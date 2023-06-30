from lib.util import get_safe_element_text, get_safe_element_number
from pyquery import PyQuery as pq
from lib.http_tool import HttpTool

http = HttpTool("https://etfdb.com")

async def get_etf_holdings(symbol, **kwargs):
  global http
  
  response = await http.get(f"/etf/{symbol}", **kwargs)
  
  if response['status'] != 200:
    return None

  d = pq(response['data'])  
  
  table = d('table[data-hash="etf-holdings"] tbody')

  holdings = []

  for row in d('tr', table):
    symbol_td = d('td[data-th="Symbol"]', row)
    symbol = get_safe_element_text(symbol_td)

    name_td = d('td[data-th="Holding"]', row)
    name = get_safe_element_text(name_td)
    
    pct_td = d('td[data-th="% Assets"]', row)
    pct = get_safe_element_number(pct_td)

    holdings.append({
      "symbol": symbol,
      "name": name,
      "pct": pct
    });

  return holdings
