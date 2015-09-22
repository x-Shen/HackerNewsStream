'''
Created on Sep 20, 2015

@author: xinshen
'''
import tool_box

# Generate and Present Ten Stories

def generate_ten_stories():
    stories = tool_box.get_top_n_stories_id(tool_box.base_url, 10, tool_box.context)
    story_list = []
    for i in range(10):
        story_list.append(tool_box.get_story_by_id(stories[i]))
    return story_list
        

def present_ten_stories():
    pass

# Ten New Stories and Ten Top Stories

# Get comments
