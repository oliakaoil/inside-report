from lib.fintool import get_detail, get_full_detail, get_etf_holdings
from lib.stock_analysis_com import make_issue_list
from lib.nosql import db
from lib.http_tool import close_all
from dateutil import parser
from datetime import datetime
import csv
import sys
import asyncio

# @todo add upsert, remove unlisted
async def update_issues():

  issues = await make_issue_list()
  skip = True

  print(f"updating {len(issues)} issues for US Markets")

  for issue in issues:
    symbol = issue['symbol']
    print(symbol)
    
    if symbol == 'AGM':
      skip = False
      
    if skip:
      continue
    
    try:
      basic_detail = await get_detail(symbol)
    except:
      basic_detail = { "symbol": symbol }
    full_detail = None # await get_full_detail(symbol)
    
    if basic_detail and full_detail:
      record = basic_detail.copy() | full_detail.copy()
    elif basic_detail:
      record = basic_detail
    else:
      record = full_detail

    # if 'quoteType' in record and record['quoteType'] == 'ETF':
    #   holdings = await get_etf_holdings(symbol,use_proxy=True)
    #   record['holdings'] = holdings if holdings else []

    existing = db.issues.find_one({ "symbol": symbol })

    if not existing:
      record['created_at'] = datetime.utcnow()
      record['deleted'] = False
      insert_id = db.issues.insert_one(record).inserted_id
      if not insert_id:
        raise Exception('insert failed')
    else:
      db.issues.update_one({'_id': existing['_id'] }, {"$set": record}, upsert=True)

  await close_all()
  print("done")

async def update_issues_lse():
  csv_file = open("lse-issue-list.tsv")
  reader = csv.reader(csv_file, delimiter="\t", quotechar='"')
  
  row_count = sum(1 for row in reader)
  csv_file.seek(0)
  
  print(f"updating {row_count} issues for LSE")
  
  skip = False

  for row in reader:
    if not row[0]:
      continue    
    
    symbol = f"{row[0]}.L"
    print(symbol)
    
    #if symbol == 'XRT':
    #  skip = False
      
    if skip:
      continue
    
    basic_detail = await get_detail(symbol)
    full_detail = await get_full_detail(symbol)
    
    if basic_detail and full_detail:
      record = basic_detail.copy() | full_detail.copy()
    elif basic_detail:
      record = basic_detail
    else:
      record = full_detail

    # @todo LSE has ETFs?
    #if 'quoteType' in record and record['quoteType'] == 'ETF':
    #  holdings = await get_etf_holdings(symbol,use_proxy=True)
    #  record['holdings'] = holdings if holdings else []

    existing = db.issues.find_one({ "symbol": symbol })

    if not existing:
      record['created_at'] = datetime.utcnow()
      record['deleted'] = False
      insert_id = db.issues.insert_one(record).inserted_id
      if not insert_id:
        raise Exception('insert failed')
    else:
      db.issues.update_one({'_id': existing['_id'] }, {"$set": record}, upsert=True)


  csv_file.close()
  
  
  
if __name__ == "__main__":
  loop = asyncio.new_event_loop()
  loop.run_until_complete(update_issues())
