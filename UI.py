'''
Created on Sep 20, 2015

@author: xinshen
'''
import tool_box
import stream_of_stories
import codecs

NewProcess = stream_of_stories.time_manager(stream_of_stories.stopFlag)
NewProcess.start()

def get_texts(time_manager):
    return time_manager.texts

def build_content(passages):
    template = open("template.html",'r')
    template = template.read()
    result = ''
    if passages!=[]:
        for i in range(10):
            box =template.find('boxen')
            result += template[:box]+passages[i]
            template =template[box+5:]
    else:
        content = tool_box.present_story_list(tool_box.top_stories)
        for i in range(10):
            box = template.find('boxen')
            result += template[:box]+content[i]
            template = template[box+5:]
        return result

#print(build_content(get_texts(NewProcess)))
    


def main():
    browseLocal(build_content(get_texts(NewProcess)))

def strToFile(text, filename):
    """Write a file with the given name and the given text."""
    with codecs.open(filename,'w',encoding='utf8') as output:
        output.write(text)
        output.close()

def browseLocal(webpageText, filename='tempBrowseLocal.html'):
    import webbrowser, os.path
    strToFile(webpageText, filename)
    webbrowser.open("file:///" + os.path.abspath(filename)) #elaborated for Mac

main()


