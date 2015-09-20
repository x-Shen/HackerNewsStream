'''
Created on Sep 20, 2015

@author: xinshen
'''

import urllib.request
import ssl
import json

base_url = 'https://hacker-news.firebaseio.com/v0/'
context = ssl._create_unverified_context()

def get_json(base,item,context):
    url = base + item + '.json?print=pretty'
    with urllib.request.urlopen(url,context=context) as response:html = response.read()
    return html

def convert_to_str(b_str):
    return b_str.decode("utf-8")

def get_top_n_stories_id(base,n,context):
    ids = get_json(base,'topstories',context)
    id_str = convert_to_str(ids)[1:-1].split(',')
    return id_str[:n]

l = get_top_n_stories_id(base_url,10,context)


def get_story_by_id(base,ID,context):
    ID = ID.strip()
    return get_json(base+'item/',ID,context)

def json_to_dict(json_file):
    d = json.loads(convert_to_str(json_file))
    return d

def present_story(d):
    s = d['title']+'\t'+str(d['score'])+'\n'+d['url']+'\n'
    return s

j = get_story_by_id(base_url,l[0],context)
print(present_story(json_to_dict(j)))




