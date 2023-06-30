from lib.slack import send
import psutil
import sys

def send_alert(err):
    message = f"IR Spider proc errorc: {err}"
    print(message)
    send(message)
    sys.exit()

try:
    
    with open('/tmp/spider.pid') as file: pid = file.read()
    
    if not pid:
        send_alert('pid file not found/empty')

    sproc = { "pid": int(pid), "name": "python3.9", "username": "oliakaoil" }

    proc_info = [proc.info for proc in psutil.process_iter(['pid', 'name', 'username'])]

    if sproc not in proc_info:
      send_alert("proc entry not found")

        
except Exception as err:
    send_alert(err)

#print('done')
