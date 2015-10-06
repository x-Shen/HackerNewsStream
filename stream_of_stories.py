'''
Created on Sep 20, 2015

@author: xinshen
'''
import tool_box
import threading


class time_manager(threading.Thread):
    def __init__(self,event=None):
        threading.Thread.__init__(self)
        self.stopped = event
        self.texts= []
    def run(self):
        while not self.stopped.wait(10):
            print("Hacker News Top Stories")
            new_stories =tool_box.generate_ten_stories(tool_box.base_url,tool_box.context,'topstories')
            print(tool_box.present_story_list(new_stories))
            self.texts.append(tool_box.present_story_list(new_stories))

stopFlag = threading.Event()           
if __name__=='__main__':
                
    thread = time_manager(stopFlag)
    thread.start()
    # this will stop the timer
    #stopFlag.set()
        
    

