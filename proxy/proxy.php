#!/usr/bin/python
# -*- coding: utf-8 -*-
'''http://code.activestate.com/recipes/286160-cgiproxypy/
'''
import cgi
import urllib2

def pagefetch(url):
    req = urllib2.Request(url)
    u = urllib2.urlopen(req)
    data = u.read()
    return data

arg = cgi.FieldStorage()
print "content-type: text/json"
print "access-control-allow-origin: *"
print                                   # so is this blank line

url = arg['url'].value

print pagefetch(url)


