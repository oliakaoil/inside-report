from datetime import datetime, timedelta
from dateutil import parser
import re
from thefuzz import fuzz

months = [
  None,
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
]

def get_safe_element_text(element):
  return str(element.text()).strip()

def get_safe_element_float(element):
  val = str(element.text()).strip()
  val = re.sub(r'[^0-9\.]','',val)
  return float(val) if val else 0

def get_safe_element_int(element):
  val = str(element.text()).strip()
  val = re.sub(r'[^0-9\.]','',val)
  return int(val) if val else 0

def get_iso_datetime(dateStr): 
  parts = dateStr.partition(",")
  year = parts[2].strip()
  monthStr = str(parts[0].partition(" ")[0]).strip()
  month = str(months.index(monthStr)).strip().rjust(2,"0")
  day = str(parts[0].partition(" ")[2]).strip()
  
  date = parser.isoparse(f"{year}-{month}-{day}").isoformat()
  
  return date


def get_time_series(start_date, end_date):
  dt = parser.isoparse(start_date)
  end = parser.isoparse(end_date)
  step = timedelta(days=1)

  dates = []

  while dt <= end:
      dates.append(dt.strftime('%Y-%m-%d'))
      dt += step  
      
  return dates

def get_best_fuzz(keyword, values):
  def fuzz_sort(value):
    return fuzz.ratio(keyword, value)
  
  values.sort(key=fuzz_sort, reverse=True)
  
  return values[0]
  
# https://stackoverflow.com/questions/312443/how-do-i-split-a-list-into-equally-sized-chunks
def chunks(lst, n):
  chunks = []
  """Yield successive n-sized chunks from lst."""
  for i in range(0, len(lst), n):
    chunks.append(lst[i:i + n])
  return chunks