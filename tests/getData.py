import json
import requests
url = 'http://rawmaps.300000kms.net/proxy/get.cgi?url=http://api.eu.socrata.com/api/catalog/v1?domains=analisi.transparenciacatalunya.cat&search_context=analisi.transparenciacatalunya.cat&limit=10000'
url = 'http://api.eu.socrata.com/api/catalog/v1?domains=analisi.transparenciacatalunya.cat&search_context=analisi.transparenciacatalunya.cat'

r = requests.get(url)
print len(r.json()['results'])


import cgi
import urllib2

def pagefetch(url):
    headers ={}
    req = urllib2.Request(url, None, headers)
    u = urllib2.urlopen(req)
    data = u.read()
    return data

#arg = cgi.FieldStorage()
#print "content-type: text/json"
#print "access-control-allow-origin: *"
#print                                   # so is this blank line


#print len(json.loads(pagefetch(url))['results'])

import cgi
form = cgi.FieldStorage()
print form.getvalue("item")
print form.list
print form.keys()
for f in form.file:
    print f
