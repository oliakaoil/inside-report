from lib.daemon import Daemon
from time import time, sleep
from datetime import date, datetime
from zoneinfo import ZoneInfo
from spider import batch as spider_batch
import sys
import asyncio
from decouple import config

# ensure UTC
# convert nyc times to UTC

spider_log = config('SPIDER_LOG', default="/tmp/ir-spider.log")


async def spider_run(last_date = None):
    nyc_date = datetime.now(tz=ZoneInfo("US/Eastern"))
    #start_date = now_nyc.strftime("%Y-%m-%d %H:%M:%S")
    filing_date = nyc_date.strftime("%Y-%m-%d")

    await spider_batch(filing_date,last_date)
        
    sleep(10 * 60)
    #sleep(10)
    
    await spider_run(nyc_date)


class SpiderDaemon(Daemon):
    def run(self):
        loop = asyncio.new_event_loop()
        loop.run_until_complete(spider_run())
 
if __name__ == "__main__":
    
    sdaemon = SpiderDaemon('/tmp/spider.pid',spider_log)
        
    if len(sys.argv) == 2:
        cmd = sys.argv[1]
        if 'start' == cmd:
            sdaemon.start()
        elif 'stop' == cmd:
            sdaemon.stop()
        elif 'restart' == cmd:
            sdaemon.restart()
        else:
            print("Unknown command")
            sys.exit(2)
        sys.exit(0)
    else:
        print("usage: %s start|stop|restart" % sys.argv[0])
        sys.exit(2)
