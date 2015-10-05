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
    p1 = '''
<html>
<head>
  <meta content="text/html; charset=UTF-8"
 http-equiv="content-type">
 <meta name="viewpoint" conent = "width=device-width">
  <title>Hacker News Stream</title>
</head>
<body>
<p>Hacker News Stream</p>
'''
    p2 ='''
</body>
</html>
'''
    if passages!='':
        return p1+passages+p2
    else:
        return p1+tool_box.present_story_list(tool_box.top_stories)+p2

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


