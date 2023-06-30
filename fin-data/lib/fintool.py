from datetime import datetime, timedelta
import holidays
from dateutil import parser

from lib.nosql import db
from lib.yahoo_finance_com import get_detail as yf_get_detail, get_details as yf_get_details, get_ticker as yf_get_ticker, get_full_detail as yf_get_full_detail
from lib.finviz_com import get_meta as fv_get_meta
from lib.etfdb_com import get_etf_holdings as ed_get_etf_holdings

import yfinance as yf

us_holidays = holidays.US()
us_holidays.observed = False

market_holidays = [
  "Labor Day",
  "Independence Day",
  "Juneteenth National Independence Day",
  "Memorial Day",
  "Washington's Birthday", # presidents' day?
  "Martin Luther King Jr. Day",
  "Thanksgiving",
  "Christmas Day",
  "New Year's Day", # @todo not always a market holiday?
  # @todo good friday not supported
]


async def get_ticker(symbol, start_date, **kwargs):
  return await yf_get_ticker(symbol, start_date, **kwargs)  

async def get_detail(symbol):
    #return await yf_get_detail(symbol)
    
    fast = yf.Ticker(symbol).fast_info
    
    return {
      'symbol': symbol,
      'currency': fast.currency, 
      'exchange': fast.exchange, 
      'shares': fast.shares,  
      'market_cap': fast.market_cap,  
      'last_price':  fast.last_price,  
      'fifty_day_average': fast.fifty_day_average, 
      'two_hundred_day_average': fast.two_hundred_day_average, 
      'ten_day_average_volume': fast.ten_day_average_volume,  
      'three_month_average_volume': fast.three_month_average_volume, 
      'year_high': fast.year_high,  
      'year_low': fast.year_low, 
      'year_change': fast.year_change
    }

async def get_details(symbols, **kwargs):
    return await yf_get_details(symbols, **kwargs)

async def get_full_detail(symbol, **kwargs):
  source1 = await yf_get_full_detail(symbol, **kwargs)
  source2 = await fv_get_meta(symbol, **kwargs)
  
  if source1 and source2:
    return source1 | source2
  
  return source1 if not source2 else source2

def get_next_market_date():
    
  date = datetime.now()
  
  while True:
    date = date + timedelta(days=1)
    
    if not is_market_day(date):
      continue
    
    break
    
  return date.strftime("%Y-%m-%d")


def get_past_market_date(days_ago,start_date=None):
  if start_date:
    start_date = parser.parse(start_date) if isinstance(start_date,str) else start_date
  else:
    start_date = datetime.today()
  
  i = 0
  date = start_date
  market_day_count = 0
  
  while market_day_count < days_ago:
    date = start_date - timedelta(days=i)
    if is_market_day(date):
      market_day_count += 1
    i += 1
    
  return parser.parse(date.strftime('%Y-%m-%d 00:00:00'))

def is_market_day(date):
  if type(date) is str:
    date = parser.isoparse(date)
    
  # market is closed on the weekend
  if date.strftime("%a") in ["Sat","Sun"]:
    return False
  
  # market is closed for certain holidays
  dateStr = date.strftime("%Y-%m-%d")
  holiday = us_holidays.get(dateStr)    
  
  if holiday and holiday in market_holidays:
    #print(f"{dateStr} is {holiday}, skipping")
    return False

  return True

def get_issue_list(market='us_market'):
  return list(db.issues.find({ "market": "us_market", "deleted": False }))

def get_issue(symbol):
  return db.issues.find_one({ "symbol": symbol, "deleted": False })

async def get_etf_holdings(symbol, **kwargs):
  return await ed_get_etf_holdings(symbol, **kwargs)
