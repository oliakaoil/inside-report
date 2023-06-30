import pymongo
from decouple import config
import sys

uri = config('MONGODB_URI', default="mongodb://localhost:27017/test")
dbname = config('MONGODB_DB', default="test")

client = None
db = None

try:

  client = pymongo.MongoClient(uri,serverSelectionTimeoutMS=2000)
  client.server_info()
  db = client[dbname]

except pymongo.errors.ServerSelectionTimeoutError as err:
    # do whatever you need
    print(f"mongodb service unavailable: {uri}")
    print(err)
    sys.exit()

