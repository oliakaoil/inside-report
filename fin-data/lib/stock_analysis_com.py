from lib.http_tool import HttpTool
from pyquery import PyQuery as pq
import json
import sys
import re

http = HttpTool("https://stockanalysis.com")

# barf
def skewer_json(text):
  # barf
  payload = text.split("{type:\"data\"")
  payload.pop(0)
  payload.pop(0)
  payload = " ".join(payload)
  payload = payload[6:len(payload) - 41]
  payload = re.sub(r"(\{|,)([a-zA-Z]+):",r'\1"\2":',payload)

  return json.loads(payload)

async def make_issue_list():     
  
  issues = []

  response = await http.get("/stocks", None, use_cache=False)
  
  d = pq(response['data'])

  # <script type="module" data-sveltekit-hydrate="1ckvvzi">
  scriptTag = d('script[type="module"]')
  rawScript = scriptTag.text()
  data = skewer_json(rawScript)['data']
     
  print(f"found {len(data)} stocks");
  
  # {'s': 'A', 'n': 'Agilent Technologies', 'i': 'Life Sciences Tools & Services', 'm': 39527837596}
  for issue in data:
    issues.append({
        'symbol': issue['s'],
        'name': issue['n'],
        'sector': issue['i'],
        'market_cap': issue['m'],
        'type': 'equity'
    })

  response = await http.get("/etf", None, use_cache=False)
  
  d = pq(response['data'])

  # <script type="module" data-sveltekit-hydrate="1ckvvzi">
  scriptTag = d('script[type="module"]')  
  rawScript = scriptTag.text()
  data = skewer_json(rawScript)['data']  
  
  #scriptTag = d('script[type="application/json"]')
  #payload = json.loads(scriptTag.text())
  #data = payload[1]['data']['data']

  print(f"found {len(data)} ETFs");
  
  for issue in data:
    # {'s': 'AAA', 'n': 'AAF First Priority CLO Bond ETF', 'i': 'Fixed Income', 'm': 7291000}
    issues.append({
      'symbol': issue['s'],
      'name': issue['n'],
      'sector': issue['i'],
      'assets': issue['m'],
      'type': 'etf'
    })

  return sorted(issues, key=lambda issue: issue['symbol'])

