'''
Created on Sep 20, 2015

@author: xinshen
'''
import tkinter
import stream_of_stories

contents_p1 = '''<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
  <meta content="text/html; charset=ISO-8859-1"
 http-equiv="content-type">
  <title>Hello</title>
</head>
<body>'''
s = open('StoryStream1','r')



contents_p2 =str(s)+'''
</body>
</html>
'''

def main():
    browseLocal(contents_p1+contents_p2)

def strToFile(text, filename):
    """Write a file with the given name and the given text."""
    output = open(filename,"w")
    output.write(text)
    output.close()

def browseLocal(webpageText, filename='tempBrowseLocal.html'):
    '''Start your webbrowser on a local file containing the text
    with given filename.'''
    import webbrowser, os.path
    strToFile(webpageText, filename)
    webbrowser.open("file:///" + os.path.abspath(filename)) #elaborated for Mac

main()


