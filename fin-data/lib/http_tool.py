from aiohttp import ClientSession, ClientTimeout, TCPConnector
import asyncio
from datetime import datetime
import json
import urllib
from decouple import config
import sys
  
proxy_api_key = config('PROXY_API_KEY', default="")
proxy_api_url = config('PROXY_API_URL', default="")

_clients = []
async def close_all():
  global _clients
  await asyncio.gather(*[client.close() for client in _clients])
  _clients = []


debug = False
  
class HttpTool:
  __private_base_url = None
  __private_session = None
  __private_session_proxy = None
  __private_headers = { 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36' 
  }
  
  def __init__(self, base_url = None):
    self.__private_base_url = base_url
    _clients.append(self)
    
  def get_session(self):
    if not self.__private_session:
      timeout = ClientTimeout(total=20)
      connector = TCPConnector(force_close=True)
      self.__private_session = ClientSession(self.__private_base_url, headers=self.__private_headers, timeout=timeout,connector=connector)
    return self.__private_session
    
  def get_session_proxy(self):
    if not self.__private_session_proxy:
      timeout = ClientTimeout(total=90)
      self.__private_session_proxy = ClientSession(proxy_api_url, timeout=timeout)
    return self.__private_session_proxy    
    
  async def close(self):
    if self.__private_session:
      await self.__private_session.close()
      self.__private_session = None
    if self.__private_session_proxy:
      await self.__private_session_proxy.close()        
      self.__private_session_proxy = None
        
  async def get(self, uri, params = {}, **kwargs):
    return await self._request('GET',uri,params,**kwargs)

  async def post(self, uri, params = {}, **kwargs):
    return await self._request('POST',uri,params,**kwargs)

  async def _request(self, method, uri, params = {}, **kwargs):
    self.get_session()
    url = self._get_url(uri)
    use_proxy = kwargs['use_proxy'] if 'use_proxy' in kwargs else False
    headers = kwargs['headers'] if 'headers' in kwargs else {}
    
    if debug:
      print(uri)
      print(f"{method} {url}")
      print(params) 
      print(headers)
    
    if use_proxy:
      # @todo add support for POST
      response =  await self._get_proxy(method, uri, params)
    else:
      if method == 'GET':
        response = await self.__private_session.get(uri, params=params,headers=headers)
      elif method == 'POST':
        response = await self.__private_session.post(uri, data=params,headers=headers)
    
    return await self._get_http_response(response)        
    
  def _get_url(self, uri):
    return f"{self.__private_base_url}{uri}" if self.__private_base_url else uri

  async def _get_proxy(self, method, uri, params):
    self.get_session_proxy()
    
    url = self._get_url(uri)
    if params:
      qs = urllib.parse.urlencode(params)
      url = f"{url}/?{qs}"
      
    prox_params = {
      'api_key': proxy_api_key,
      'url': url,
      'render_js': 'false',
      'premium_proxy': 'true'
    }
    
    if debug:
      print(f"using proxy for {url}")

    return await self.__private_session_proxy.get("/api/v1", params=prox_params)
  

  async def _get_http_response(self, response):
    try:
      if response.headers['Content-Type'].startswith("application/json"):
        data = await response.json()
        json = True
      else:
        data = await response.text()
        json = False      
    except Exception as err:
      print("Error getting response")
      print(err)
      print(response)
      data = ""
      json = False

    return { 'data': data, 'json': json, 'status': response.status }

