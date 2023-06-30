#!/bin/bash

BASE_PATH=/home/oliakaoil/inside-report/spider

cd $BASE_PATH;
source venv/bin/activate;
python3.9 ./monitor.py >> /tmp/spider-monitor.log 2>&1
