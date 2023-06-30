from datetime import date, datetime, timedelta
import asyncio
from time import time, sleep
import sys

from lib.fastedgar_com import get_filings, get_filing, parse_net_action, parse_symbols
from lib.http_tool import close_all
from lib.nosql import db
from lib.util import chunks


async def backfill():
    
    fdate = datetime.strptime("2022-12-26", "%Y-%m-%d")
    frange = 3
    print(f"Backfilling data {frange} days back starting 1 day before {fdate}")    

    for i in range(frange):
        fdate = fdate - timedelta(days=1)
        await batch(fdate.strftime("%Y-%m-%d"))
        sleep(1 * 60)
    
    print('done')
    sys.exit()

# main daemon action
async def batch(fdate, ldate = None):

  try:      
    filings = await get_filings(fdate, ldate)
  except Exception as inst:
    print('could not retrieve filings')
    print(inst)
    return

  print(f"running {len(filings)} filings for fdate = {fdate} | ldate = {ldate}")

  start_time = time()
  
  fchunks = chunks(filings, 10)
  
  for fchunk in fchunks:        
    #for filing in fchunk:
      # print(f"checking {filing['id']} - {filing['url']}")

    await asyncio.gather(*[update_filing(filing) for filing in fchunk])
      
  await close_all()

  end_time = time()

  print(f"done in {round(end_time - start_time, 2)}s")


async def update_filing(filing):
  fdata = await get_filing(filing)
    
  if not fdata or not 'type' in fdata or fdata['type'] != 'form 4':
    return

  fdata['last_modified'] = int(time())
  fdata.pop('id', None)

  # upsert
  db.filings.update_one({ "filing_id": fdata['filing_id'] }, { "$set": fdata }, upsert=True)


async def patch_filing_meta():
  done = False
  skip = 0
  per_page = 300
  
  while not done:
    
    filings = db.filings.find({}).limit(per_page).skip(skip)
    filing_count = 0
        
    for filing in filings:
      filing_count += 1
      
      # clean up symbols, add extra_symbols, raw_symbol
      if filing['meta']['raw_symbol'].upper() != 'NONE':
        continue

      raw_symbol = filing['meta']['symbol']
      symbols = parse_symbols(raw_symbol)
      
      filing['meta'].update({ "symbol": symbols[0], "raw_symbol": raw_symbol, "extra_symbols": symbols[1:] })

      # set the net action
      #filing['meta'].update({ "net_action": parse_net_action(filing['meta']) })
            
      # remove the erroneous id field
      #filing.pop('id', None)
      #db.filings.update_one({ "filing_id": filing['filing_id'] }, { "$unset": {"id": ""} })
      
      # partial update
      db.filings.update_one({ "filing_id": filing['filing_id'] }, { "$set": filing })
           
    print(f"{skip} {filing_count}")
    done = filing_count < per_page
    skip += per_page
  

async def test():
  test_doc = {"path": "/20221117/AG2HW62CZ2227Z7Z2B2L2ZO2O4IBZU22Z242/", "id": "AG2HW62CZ2227Z7Z2B2L2ZO2O4IBZU22Z242"}
  fdata = await get_filing(test_doc)
  
  print(fdata)
  sys.exit()

if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    loop.run_until_complete(backfill())
    #loop.run_until_complete(patch_filing_meta())
