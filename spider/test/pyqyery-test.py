from pyquery import PyQuery as py
import sys

def get_table(el):
    table = py(el)
    head = table('thead')
    
    body = table('tbody')
    
    print(len(head))

html = """
<h1>Sales</h1>
<table id="table">
<thead>
<tr>
    <td>header 1</td>
    <td>header 2</td>
</tr>
</thead>
<tr>
    <td>Lorem</td>
    <td>46</td>
</tr>
<tr>
    <td>Ipsum</td>
    <td>12</td>
</tr>
<tr>
    <td>Dolor</td>
    <td>27</td>
</tr>
<tr>
    <td>Sit</td>
    <td>90</td>
</tr>
</table>
"""

doc = py(html)

get_table(doc('table:eq(0)'))
sys.exit()

title = doc('h1').text()

print(title)

table_data = []

rows = doc('table:eq(0) > tr')
for row in rows:
    #name = py(row).find('td').eq(0).text()
    row = py(row)
    name = row('td:eq(0)').text()
    #value = py(row).find('td').eq(1).text()
    value = row('td:eq(1)').text()

    print("%s\t  %s" % (name, value))


