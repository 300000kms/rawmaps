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

#url = arg['url'].value
#http://rawmaps.300000kms.net/proxy/get.cgi?url=https://opendata-ajuntament.barcelona.cat/data/dataset/6960936a-95ed-4cc4-a6ec-e089197ccd8b/resource/c122329d-d26d-469e-bf9e-8efa10e4c127/download
#https://opendata-ajuntament.barcelona.cat/data/dataset/6960936a-95ed-4cc4-a6ec-e089197ccd8b/resource/c122329d-d26d-469e-bf9e-8efa10e4c127/download
url = 'https://opendata-ajuntament.barcelona.cat/data/dataset/6960936a-95ed-4cc4-a6ec-e089197ccd8b/resource/c122329d-d26d-469e-bf9e-8efa10e4c127/download'
print pagefetch(url)


