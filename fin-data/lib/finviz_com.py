from lib.util import get_safe_element_text, get_safe_element_number
from pyquery import PyQuery as pq
from lib.http_tool import HttpTool

http = HttpTool("https://finviz.com")

async def get_meta(symbol, **kwargs):
  global http
  # https://finviz.com/quote.ashx?t=META&p=d
  
  response = await http.get(f"/quote.ashx", { "t": symbol, 'p': 'd' })
  
  if response['status'] != 200:
    return None
  
  d = pq(response['data'])  
  
  links = d('table.fullview-title td.fullview-links a.tab-link')
  sector_link = links.eq(0)
  sector = get_safe_element_text(sector_link)
  
  industry_link = links.eq(1)
  industry = get_safe_element_text(industry_link)
  
  meta_table = d('table.snapshot-table2')
  optionable = get_safe_element_text(d('tr:eq(9) td:eq(1)', meta_table)) == 'Yes'
  
  atr = get_safe_element_number(d('tr:eq(7) td:eq(11)', meta_table))
  rsi14 = get_safe_element_number(d('tr:eq(8) td:eq(9)', meta_table))
  
  return {
      "gicsSector": sector,
      "industry": industry,
      "optionable": optionable,
      "atr": atr,
      "rsi14": rsi14
  }