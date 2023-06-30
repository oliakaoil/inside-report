from datetime import datetime
from dateutil.parser import parse
from lib.http_tool import HttpTool
import hashlib
from base64 import b64decode
usePycryptodome = False  # slightly faster
# usePycryptodome = True
if usePycryptodome:
    from Crypto.Cipher import AES
    from Crypto.Util.Padding import unpad
else:
    from cryptography.hazmat.primitives import padding
    from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

import asyncio
import json
import re
import sys

yFinNumber = { "raw": None }

http_quote = HttpTool("https://query2.finance.yahoo.com")
http = HttpTool()

def get_dot(key, val):
  parts = key.split(".")

  for part in parts:
    if type(val) is not dict:
      val = None
      break
    val = val.get(part, None)

  return val

async def get_detail(symbol, **kwargs):     
  detail = {
    "symbol": symbol,
    "date": datetime.now().isoformat(),
    "title": "",
    "about": "",
    "sector": "",
    "beta": 0,
    "analystRating": "",
    "averageVolume10days": 0,
    "lastClose": 0,
    "quoteType": "",
    "market": ""
  }
    
  response = await http.get(f"https://finance.yahoo.com/quote/{symbol}", None, **kwargs)
  
  if response['status'] != 200:
    return None

  json_str = response['data'].split('root.App.main =')[1].split(
    '(this)')[0].split(';\n}')[0].strip()

  data = json.loads(json_str)
  
  
  print(data)
  sys.exit()  

  if "_cs" in data and "_cr" in data:
      data = decrypt_cryptojs_aes(data)

  if "context" in data and "dispatcher" in data["context"]:
      # Keep old code, just in case
      data = data['context']['dispatcher']['stores']

  # return data
  new_data = json.dumps(data).replace('{}', 'null')
  new_data = re.sub(
      r'{[\'|\"]raw[\'|\"]:(.*?),(.*?)}', r'\1', new_data)

  #try:
  #  data = json.loads(jsonStr)['context']['dispatcher']['stores']['QuoteSummaryStore']
  #except:
  #  print(f"cannot load yfin data for {symbol}")
  #  data = {}    

  # summaryDetail
  detail['beta'] = get_dot("summaryDetail.beta.raw", data)
  detail['averageVolume10days'] = get_dot("summaryDetail.averageVolume10days.raw", data)
  detail['lastClose'] = get_dot("summaryDetail.previousClose.raw", data)

  # quoteType
  detail["title"] = get_dot("quoteType.longName", data)
  detail["quoteType"] = get_dot("quoteType.quoteType", data)
  
  # summaryProfile
  detail["about"] = get_dot("summaryProfile.longBusinessSummary",data)
  detail["sector"] = get_dot("summaryProfile.sector",data)
  
  # financialData
  detail["analystRating"] = get_dot("financialData.recommendationKey",data)

  # price
  detail['market'] = get_dot("price.exchange", data)
  
  return detail     
 

async def get_details(symbols, **kwargs):
  response = await asyncio.gather(*[get_detail(symbol, **kwargs) for symbol in symbols])
  details = {}
  for detail in response:
    details[detail["symbol"]] = detail
  return details

async def get_full_detail(symbol, **kwargs):
  fixed_timestamp = int(parse("2021-01-01 00:00:00").timestamp())
  response = await http_quote.get(f"/v7/finance/options/{symbol}", {'date': fixed_timestamp}, **kwargs)
  
  if not "optionChain" in response['data']:
    return {}
    
  result = response['data']['optionChain']['result']

  if result and len(result):
    return result[0]['quote']

  return {}


"""
:Parameters:
    period : str
        Valid periods: 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max
        Either Use period parameter or use start and end
    interval : str
        Valid intervals: 1m,2m,5m,15m,30m,60m,90m,1h,1d,5d,1wk,1mo,3mo
        Intraday data cannot extend last 60 days
    start_date: str
        Download start date string (YYYY-MM-DD) or _datetime.
        Default is 1900-01-01
    end_date: str
        Download end date string (YYYY-MM-DD) or _datetime.
        Default is now
"""
async def get_ticker(symbol, start_date, **kwargs):
  
  ##  end_date = None
    
  start = parse(f"{start_date} 00:00:00") if isinstance(start_date,str) else start_date
  end = parse(f"{start.strftime('%Y-%m-%d')} 23:59:59")
  
  if 'end_date' in kwargs:
    end = parse(f"{kwargs['end_date']} 23:59:59") if isinstance(kwargs['end_date'],str) else kwargs['end_date']
    
  params = {
    "interval": kwargs['interval'] if 'interval' in kwargs else "1d", # 1m,2m,5m,15m,30m,60m,90m,1h,1d,5d,1wk,1mo,3mo
    "includePrePost": "true" if 'pre_post' in kwargs and kwargs['pre_post'] else "false", # include pre-market and post-market data
    "period1": int(start.timestamp()),
    "period2": int(end.timestamp()),
    # events: div|splits
  }
  
  #1) fix weired bug with Yahoo! - returning 60m for 30m bars
  #if params["interval"] == "30m":
  #  params["interval"] = "15m"

  response = await http_quote.get(f"/v8/finance/chart/{symbol}", params, **kwargs)
            
  if response['status'] != 200:
    return None
  
  data = response['data']
  
  if "chart" not in data or not data["chart"]:
    print("malformed response from yf ticker data api")
    return
    
  data = data["chart"]
  error = data["error"]
  results = data["result"]
  
  if error:
    print(f"yf ticker data api error: {error}")
    return
  
  tickers = []
  quote = results[0]['indicators']['quote'][0]
  timestamps = results[0]['timestamp'] if 'timestamp' in results[0] else []
  
  if not 'open' in quote:
    print(f"no quote data available for {symbol}")
    return
  
  for i in range(0, len(quote['open'])):
    tickers.append({
      "open": quote['open'][i],
      "close": quote['close'][i],
      "high": quote['high'][i],
      "low": quote['low'][i],
      "volume": quote['volume'][i],
      "date": datetime.fromtimestamp(timestamps[i]).isoformat()
    })
  return tickers


async def get_option_exp_dates(symbol,**kwargs):
  response = await http_quote.get(f"/v7/finance/options/{symbol}", None, **kwargs)  
  timestamps = response['data']['optionChain']['result'][0]['expirationDates']
  return [datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d') for timestamp in timestamps]

async def get_option_chain(symbol,exp_date,**kwargs):
  
  exp = parse(f"{exp_date} 00:00:00")
  response = await http_quote.get(f"/v7/finance/options/{symbol}", {'date': int(exp.timestamp())}, **kwargs)

  print(response)
  result = response['data']['optionChain']['result'][0]
  quote = result[0]


def decrypt_cryptojs_aes(data):
    encrypted_stores = data['context']['dispatcher']['stores']
    _cs = data["_cs"]
    _cr = data["_cr"]

    _cr = b"".join(int.to_bytes(i, length=4, byteorder="big", signed=True) for i in json.loads(_cr)["words"])
    password = hashlib.pbkdf2_hmac("sha1", _cs.encode("utf8"), _cr, 1, dklen=32).hex()

    encrypted_stores = b64decode(encrypted_stores)
    assert encrypted_stores[0:8] == b"Salted__"
    salt = encrypted_stores[8:16]
    encrypted_stores = encrypted_stores[16:]

    def EVPKDF(password, salt, keySize=32, ivSize=16, iterations=1, hashAlgorithm="md5") -> tuple:
        """OpenSSL EVP Key Derivation Function
        Args:
            password (Union[str, bytes, bytearray]): Password to generate key from.
            salt (Union[bytes, bytearray]): Salt to use.
            keySize (int, optional): Output key length in bytes. Defaults to 32.
            ivSize (int, optional): Output Initialization Vector (IV) length in bytes. Defaults to 16.
            iterations (int, optional): Number of iterations to perform. Defaults to 1.
            hashAlgorithm (str, optional): Hash algorithm to use for the KDF. Defaults to 'md5'.
        Returns:
            key, iv: Derived key and Initialization Vector (IV) bytes.
        Taken from: https://gist.github.com/rafiibrahim8/0cd0f8c46896cafef6486cb1a50a16d3
        OpenSSL original code: https://github.com/openssl/openssl/blob/master/crypto/evp/evp_key.c#L78
        """

        assert iterations > 0, "Iterations can not be less than 1."

        if isinstance(password, str):
            password = password.encode("utf-8")

        final_length = keySize + ivSize
        key_iv = b""
        block = None

        while len(key_iv) < final_length:
            hasher = hashlib.new(hashAlgorithm)
            if block:
                hasher.update(block)
            hasher.update(password)
            hasher.update(salt)
            block = hasher.digest()
            for _ in range(1, iterations):
                block = hashlib.new(hashAlgorithm, block).digest()
            key_iv += block

        key, iv = key_iv[:keySize], key_iv[keySize:final_length]
        return key, iv

    key, iv = EVPKDF(password, salt, keySize=32, ivSize=16, iterations=1, hashAlgorithm="md5")

    if usePycryptodome:
        cipher = AES.new(key, AES.MODE_CBC, iv=iv)
        plaintext = cipher.decrypt(encrypted_stores)
        plaintext = unpad(plaintext, 16, style="pkcs7")
    else:
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
        decryptor = cipher.decryptor()
        plaintext = decryptor.update(encrypted_stores) + decryptor.finalize()
        unpadder = padding.PKCS7(128).unpadder()
        plaintext = unpadder.update(plaintext) + unpadder.finalize()
        plaintext = plaintext.decode("utf-8")

    decoded_stores = json.loads(plaintext)
    return decoded_stores