from zoneinfo import ZoneInfo
from datetime import datetime, timezone
from dateutil.parser import parse

#fdate = datetime.today()

fdate = datetime.now(tz=ZoneInfo("US/Eastern"))

#fdate = datetime.now()

#fdate = fdate.replace(tzinfo=ZoneInfo(key='UTC'))

#print(fdate.strftime("%Y-%m-%d %H:%M:%S"))


doc_date = "2022-11-16 19:39"
pdate = parse(doc_date)
pdate = pdate.replace(tzinfo=ZoneInfo("US/Eastern"))

#print(doc_date)
print(pdate)
print(fdate)
#print(pdate.tzinfo)

if pdate > fdate:
    print('pdate comes after fdate')
else:
    print('pdate comes before fdate')

# we have a date that looks like this: 2022-11-14 19:39

# we need to convert that to a date object, and set the timezone to NYC