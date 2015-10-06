'''
Created on Sep 20, 2015

@author: xinshen
'''

import urllib.request
import ssl
import json

count = 1

base_url = 'https://hacker-news.firebaseio.com/v0/'
context = ssl._create_unverified_context()

def get_json(base,item,context):
    url = base + item + '.json?print=pretty'
    with urllib.request.urlopen(url,context=context) as response:html = response.read()
    return html

def convert_to_str(b_str):
    try:
        return b_str.decode("utf-8")
    except:
        return "Error occured."

def get_top_n_stories_id(base,n,type_of,context):
    ids = get_json(base,type_of,context)
    id_str = convert_to_str(ids)[1:-1].split(',')
    return id_str[:n]

#l = get_top_n_stories_id(base_url,10,context)


def get_story_by_id(base,ID,context):
    ID = ID.strip()
    return get_json(base+'item/',ID,context)

def json_to_dict(json_file):
    d = json.loads(convert_to_str(json_file))
    return d

def present_story(d):
    try:
        s = d['title']+'\t'+str(d['score'])+'\n'+d['url']+'\n'
    except:
        return 'Error occurred.'
    return s

#j = get_story_by_id(base_url,l[0],context)
#print(present_story(json_to_dict(j)))

def generate_ten_stories(base,context,type_of):
    stories = get_top_n_stories_id(base, 10,type_of, context)
    story_list = []
    for i in range(10):
        story_list.append(get_story_by_id(base,stories[i],context))
    return story_list

def present_story_list(stories):
    result = []
    for story in stories:
        result.append(present_story(json_to_dict(story)))
    return result

top_stories = generate_ten_stories(base_url,context,'topstories')
new_stories =  generate_ten_stories(base_url,context,'newstories')        
if __name__ =='__main__':
    print(present_story_list(top_stories))


    





