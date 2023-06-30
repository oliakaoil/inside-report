from datetime import date
from dateutil.parser import parse
from zoneinfo import ZoneInfo
from lib.util import get_safe_element_text, get_safe_element_float
from pyquery import PyQuery as pq
from lib.http_tool import HttpTool
import sys
import re

base_url = "https://archive.fast-edgar.com"
http = HttpTool(base_url)

async def get_filings(fdate,ldate=None):
  global http
    
  edgar_date = fdate.replace('-','')
  
  response = await http.get(f"/{edgar_date}")
  
  if response['status'] != 200:
    return []

  filings = []
  
  d = pq(response['data'])  
  
  table = d('table')
  
  for tr in d('tr', table):
  
    link = d('td:eq(1) a', tr)
    
    if not link.length:
        continue
    
    link_href = link.attr('href')
    
    if not re.match("[A-Z0-9]+\/", link_href):
        continue
    
    doc_id = link_href[0:-1]
    doc_path = f"/{edgar_date}/{doc_id}/"
    doc_url = f"{base_url}{doc_path}"
    doc_date = get_safe_element_text(d('td:eq(2)', tr))
    
    if ldate:
      pdate = parse(doc_date)
      pdate = pdate.replace(tzinfo=ZoneInfo("US/Eastern"))
      if pdate < ldate:
        continue
    
    filings.append({
        "filing_id": doc_id,
        "path": doc_path,
        "url": doc_url,
        "date": doc_date
    })

  return filings


async def get_filing(doc):
  global http
  response = await http.get(doc['path'])
  
  if response['status'] != 200:
    return None
  
  if 'data' not in response or not response['data']:
    return None
  
  d = pq(response['data'])      
  
  table = d('table').eq(0)
  
  dt_row = d('tr', table).eq(0)
  doc_type = get_safe_element_text(d('td', dt_row).eq(0)).lower()
  
  meta = {}
  
  if doc_type == 'form 4':
      meta = parse_filing_form4(d)

  doc['meta'] = meta
  doc['type'] = doc_type
  
  return doc
    
  # https://www.sec.gov/forms
    
  # Form 4 Statement of changes in beneficial ownership
  # http://archive.fast-edgar.com/20221101/ABZ2L22CSM22BTSA22282ZZ2TJ3LC228Z242
  
  
def parse_filing_form4(d):
  
  def get_name():
    table = d('table:eq(4)')
    td = d('td:eq(0)', table)
    
    name_el = d('a', td)
    name = get_safe_element_text(name_el)
    url = name_el.attr('href')
    
    return {
      "name": name,
      "name_cik": url.split('CIK=')[1]
    }

  def get_symbol():
    table = d('table:eq(4)')
    td = d('td:eq(13)', table)
        
    symbol_el = d('span:eq(1)', td)
    raw_symbol = get_safe_element_text(symbol_el)

    symbols = parse_symbols(raw_symbol)
    
    return {
      "raw_symbol": raw_symbol,
      "symbol": symbols[0],
      "extra_symbols": symbols[1:]
    }

  def get_issuer():
    table = d('table:eq(4)')
    td = d('td:eq(13)', table)
    
    issuer_el = d('a:eq(0)', td)
    issuer = get_safe_element_text(issuer_el)
    url = issuer_el.attr('href')    
    
    return {
      "issuer": issuer,
      "issuer_cik": url.split("CIK=")[1],
    }
    
  def get_address():
    table = d('table:eq(4)')
    td = d('td:eq(5)', table)
    address1 = get_safe_element_text(d('span:eq(0)', td))
    
    td = d('td:eq(6)', table)
    address2 = get_safe_element_text(d('span:eq(0)', td))    
    
    td = d('td:eq(7)', table)
    city = get_safe_element_text(d('span:eq(0)', td))    
    
    td = d('td:eq(8)', table)
    state = get_safe_element_text(d('span:eq(0)', td))    
    
    td = d('td:eq(9)', table)
    zip = get_safe_element_text(d('span:eq(0)', td))
    
    return {
      "address1": address1,
      "address2": address2,
      "city": city,
      "state": state,
      "zip": zip,
    }
    
  def get_relationship():
    table = d('table:eq(4)')
    
    # director
    td = d('td:eq(15)', table)
    if __is_checked(d('span', td)):
      return { 'relationship': 'director' }

    # 10% owner
    td = d('td:eq(17)', table)
    if __is_checked(d('span', td)):
      return { 'relationship': 'owner' }    
    
    td = d('td:eq(23)', table)
    detail = get_safe_element_text(d('span', td))
    
    # officer
    td = d('td:eq(19)', table)
    if __is_checked(d('span', td)):
      return { 'relationship': 'officer', 'relationship_detail': detail }     
       
    # other
    td = d('td:eq(21)', table)
    if __is_checked(d('span', td)):
      return { 'relationship': 'other', 'relationship_detail': detail }   

    return {}
  
  def get_early_date():
    table = d('table:eq(4)')
    td = d('td:eq(24)', table)
    
    sdate = __get_date(d('span:eq(1)', td))

    if sdate:
      return { "early_date": sdate }
    
    return {}
        
  def get_ammend_date():
    table = d('table:eq(4)')
    td = d('td:eq(25)', table)
    
    sdate = __get_date(d('span:eq(1)', td))

    if sdate:
      return { "ammend_date": sdate }
    
    return {}  
  
  def get_joint_status():
    table = d('table:eq(4)')  
    
    td = d('td:eq(27)', table)
    checked = get_safe_element_text(d('span', td))
    if checked == 'X':
      return { 'joint_filing': False }       
    
    td = d('td:eq(29)', table)
    if __is_checked(d('span', td)):
      return { 'joint_filing': False }     
    
    td = d('td:eq(31)', table)
    if __is_checked(d('span', td)):
      return { 'joint_filing': True }     
    
    return {}
  
  def get_non_derivatives():
    rows = d('table:eq(12) > tbody > tr')
    
    data = []
    
    for row in rows:
      row = pq(row)

      # title of security
      title = get_safe_element_text(row('td:eq(0) > span:eq(0)'))
      
      # transaction date
      tdate = __get_date(row('td:eq(1) > span:eq(0)'))
      
      # deemed execution date
      ddate = __get_date(row('td:eq(2) > span:eq(0)'))      
      
      # transaction code
      transaction_code = get_safe_element_text(row('td:eq(3) > span:eq(0)'))  
      
      # transaction v
      transaction_v = get_safe_element_text(row('td:eq(4) > span:eq(0)'))
      
      # amount
      amount = get_safe_element_float(row('td:eq(5) > span:eq(0)'))
       
      # acquired or disposed
      action = get_safe_element_text(row('td:eq(6) > span:eq(0)'))
      
      # price
      price = get_safe_element_text(row('td:eq(7) > span:eq(1)'))
      
      # amount owned
      amount_owned = get_safe_element_float(row('td:eq(8) > span:eq(0)'))
      
      # ownership form
      ownership_form = get_safe_element_text(row('td:eq(9) > span:eq(0)'))
      
      # nature of indirect beneficial ownership (intstr. 4)
      instrument_4 = get_safe_element_text(row('td:eq(10) > span:eq(0)'))          
      
      data.append({
        "title": title,
        "transaction_date": tdate,
        "deemed_date": ddate,
        "transaction_code": transaction_code,
        "transaction_v": transaction_v,
        "amount": amount,
        "action": action,
        "price": price,
        "amount_owned": amount_owned,
        "ownership_form": ownership_form,
        "instrument_4": instrument_4
      })

      
      # @todo resolve price td reference to other columns

    return data
  
  
  def get_derivatives():
    rows = d('table:eq(13) > tbody > tr')
    
    data = []
    
    for row in rows:
      row = pq(row)  
      
      # title (i.e. convertible note)
      title = get_safe_element_text(row('td:eq(0) > span:eq(0)'))
      
      # conversion or exercise price
      ex_price = get_safe_element_float(row('td:eq(1) > span:eq(1)'))
      
      # transaction date
      transaction_date = __get_date(row('td:eq(2) > span:eq(0)'))
      
      # deemed date
      deemed_date = __get_date(row('td:eq(3) > span:eq(0)'))
      
      # transaction code
      transaction_code = get_safe_element_text(row('td:eq(4) > span:eq(0)'))
      
      # transaction v
      transaction_v = get_safe_element_text(row('td:eq(5) > span:eq(0)'))
      
      # number acquired
      amount_acquired = get_safe_element_float(row('td:eq(6) > span:eq(0)'))
      
      # number disposed
      amount_disposed = get_safe_element_float(row('td:eq(7) > span:eq(0)'))
      
      # exercisable date
      ex_date = __get_date(row('td:eq(8) > span:eq(0)'))
      
      # exp date
      exp_date = __get_date(row('td:eq(9) > span:eq(0)'))
      
      # title (i.e. common stock)
      security_title = get_safe_element_text(row('td:eq(10) > span:eq(0)'))
      
      # amount
      security_amount = get_safe_element_float(row('td:eq(11) > span:eq(0)'))
      
      # price of derivative
      price = get_safe_element_float(row('td:eq(12) > span:eq(0)'))
      
      # number owned following transaction
      amount_owned = get_safe_element_float(row('td:eq(13) > span:eq(0)'))
      
      # ownership form
      ownership_form = get_safe_element_text(row('td:eq(14) > span:eq(0)'))
      
      # nature of indirect beneficial ownership (instr. 4)
      instrument_4 = get_safe_element_text(row('td:eq(15) > span:eq(0)'))   
      
      data.append({
        "title": title,
        "ex_price": ex_price,
        "transaction_date": transaction_date,
        "deemed_date": deemed_date,
        "transaction_code": transaction_code,
        "transaction_v": transaction_v,
        "amount_acquired": amount_acquired,
        "amount_disposed": amount_disposed,
        "ex_date": ex_date,
        "exp_date": exp_date,
        "security_title": security_title,
        "security_amount": security_amount,
        "price": price,
        "amount_owned": amount_owned,
        "ownership_form": ownership_form,
        "instrument_4": instrument_4
      })
      
  
  
    return data
  
  
  def get_created_date():
    table = d('table:eq(15)')
    td = d('td:eq(2)', table)
    date = __get_date(d('span:eq(0)', td))
    
    return { "created_date": date }
      
  meta = {}
  meta.update(get_name())
  meta.update(get_issuer())
  meta.update(get_symbol())
  meta.update(get_address())
  meta.update(get_relationship())
  meta.update(get_early_date())
  meta.update(get_ammend_date())
  meta.update(get_joint_status())
  meta.update({ "non_derivatives": get_non_derivatives()})
  meta.update({ "derivatives": get_derivatives()})
  meta.update(get_created_date())
  meta.update({ "net_action": parse_net_action(meta) })

  return meta


def __is_checked(el):
  return get_safe_element_text(el) == 'X'


def __get_date(el):
  date = get_safe_element_text(el)
  parts = date.split('/')  

  if len(parts) == 3:
    return f"{parts[2]}-{parts[0]}-{parts[1]}"
  
  return ""

def parse_net_action(meta):
  
  derivatives = meta['derivatives']
  non_derivatives = meta['non_derivatives']
  
  if  not len(derivatives) and not len(non_derivatives):
    return "nonaction"

  acquired = 0
  disposed = 0

  if len(derivatives):
    for derivative in derivatives:  
      if 'amount_acquired' in derivative and derivative['amount_acquired']:
        acquired = acquired + derivative['amount_acquired']
    
      if 'amount_disposed' in derivative and derivative['amount_disposed']:
        disposed = disposed + derivative['amount_disposed']    


  if len(non_derivatives):
    for nd in non_derivatives:
      if not 'action' in nd or not nd['action']:
        continue

      if not 'amount' in nd or not nd['amount']:
        continue
      
      amount = nd['amount']
      action_id = str(nd['action']).upper()[0]
      
      if action_id == "A":
        acquired = acquired + amount
      elif action_id == "D":
        disposed = disposed + amount


  if acquired and not disposed:
    return "buy"

  if disposed and not acquired:
    return "sell"

  if disposed and acquired:
    return "both"

  return "unknown"


def parse_symbols(val):
    val = str(val).upper().strip()

    # cleanup parenthesis and brackets
    if re.search("^(\(|\[).+(\)|\])$", val):
        val = val[1:len(val) - 1]

    # not applicable
    if val == "N/A" or val == "NONE":
        val = "no-symbol"

    # market prefix
    if re.search("^NYSE: *.+",val):
        val = re.sub("^NYSE: *","",val)

    # one-offs
    if re.search("^.+ AND .+$",val):
        val = val.split(" AND ")

    # delimited list
    if type(val) is str:
        m_regex = "(;|,|/)"
        multiple = re.split(m_regex,val)
        if len(multiple) > 1:
            val = [m.strip() for m in multiple if not re.search(m_regex, m)]

    return val if type(val) is list else [val]  