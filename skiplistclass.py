from random import randint, seed
import math
import csv


class SkipNode:
    """A node from a skip list"""    
    def __init__(self, height = 0, elem = None):
        self.elem = elem
        # defines a next element to be pointing to None times the height 
        self.next = [None]*height

class SkipList:

    def __init__(self):
        self.head = SkipNode()
        self.len = 0
        self.maxHeight = 0

    # defines length magic method as an accessor
    def __len__(self):
        return self.len

    # updates list to keep track of elems
    # and make insert and removal simple

    def updateList(self, elem):
        update = [None]*self.maxHeight
        x = self.head
        for i in reversed(range(self.maxHeight)):
            while x.next[i] != None and x.next[i].elem < elem:
                x = x.next[i]
            update[i] = x
        return update

    # defines function that finds an element in a skiplist
    def find(self, elem, update = None):
        if update == None:
            update = self.updateList(elem)
        if len(update) > 0:
            candidate = update[0].next[0]
            if candidate != None and candidate.elem == elem:
                return candidate
        return None
    

    # finds a specified population element in a population
    # skiplist
    def populationfind(self, elem, search, update = None):
        # will be used to create a list of dictionaries
        # to represent the skip list
        dictlist = []
        # creates a list of all found elements
        foundlist = []

        # iterates through entire skip list and makes the dictlist
        for i in range(len(self.head.next)-1, -1, -1):
            x = self.head
            while x.next[i] != None:
                dictlist.append(x.next[i].elem),
                x = x.next[i]

        # filters through for initials
        if search == 'initial':
            for item in dictlist:
                statename = item.keys()
                if item != None and statename[0][0] == elem:
                    foundlist.append(item)

                    # removes item from the original skiplist to 
                    # avoid infinite loop
                    self.remove(item)
            return foundlist

        elif search == 'popgreater':
            for item in dictlist:
                # gets all the values into a list

                vals = item.values()

                # filters if the population is greater than elem parameter
                if item != None and vals[0]['POPESTIMATE2013'] > elem:
                    foundlist.append(item)
                    self.remove(item)
            return foundlist

        else:
            for item in dictlist:
                # gets all the values into a list

                vals = item.values()
                if item != None and vals[0]['POPESTIMATE2013'] < elem:
                    foundlist.append(item)
                    self.remove(item)
            return foundlist

    # similar to population
    def ordersfind(self, elem, update = None):
        # will be used to create a list of dictionaries
        # to represent the skip list
        dictlist = []
        # creates a list of all found elements
        foundlist = []

        # iterates through entire skip list and makes the dictlist
        for i in range(len(self.head.next)-1, -1, -1):
            x = self.head
            while x.next[i] != None:
                dictlist.append(x.next[i].elem),
                x = x.next[i]

        for item in dictlist:

            title = item.keys()
            titlewords = title[0].split()

            if item != None and elem in titlewords:
                foundlist.append(item)
                self.remove(item)
        return foundlist
       
    # similar to last two functions
    def grantfind(self, elem, search, update = None):
        # will be used to create a list of dictionaries
        # to represent the skip list
        dictlist = []
        # creates a list of all found elements
        foundlist = []

        # iterates through entire skip list and makes the dictlist
        for i in range(len(self.head.next)-1, -1, -1):
            x = self.head
            while x.next[i] != None:
                dictlist.append(x.next[i].elem),
                x = x.next[i]

        # checks for the type of search parameter
        if search == 'name_cont':
            for item in dictlist:

                title = item.keys()
                titlewords = title[0].split()


                if item != None and elem in titlewords:
                    foundlist.append(item)
                    self.remove(item)
            return foundlist
        else:
            for item in dictlist:

                importantvals = item.values()
                description = importantvals[0]['Award Title or Description']
                descriptionwords = description.split()


                if item != None and elem in descriptionwords:
                    foundlist.append(item)
                    self.remove(item)
            return foundlist


    # function checks if skiplist contains elem
    def contains(self, elem, update = None):
        return self.find(elem, update) != None

    # introduces probability into the creation of skiplists
    def randomHeight(self):
        height = 1
        while randint(1, 2) != 1:
            height += 1
        return height

        
    def insert(self, elem):

        node = SkipNode(self.randomHeight(), elem)

        self.maxHeight = max(self.maxHeight, len(node.next))
        while len(self.head.next) < len(node.next):
            self.head.next.append(None)

        update = self.updateList(elem)            
        if self.find(elem, update) == None:
            for i in range(len(node.next)):
                node.next[i] = update[i].next[i]
                update[i].next[i] = node
            self.len += 1

    def remove(self, elem):

        update = self.updateList(elem)
        x = self.find(elem, update)
        if x != None:
            for i in reversed(range(len(x.next))):
                update[i].next[i] = x.next[i]
                if self.head.next[i] == None:
                    self.maxHeight -= 1
            self.len -= 1            
                
    def printList(self):
        for i in range(len(self.head.next)-1, -1, -1):
            x = self.head
            while x.next[i] != None:
                print x.next[i].elem, 
                x = x.next[i]
            print ''

if __name__ == '__main__':
    # testing insertion of a basic int skiplist
    intSkip = SkipList()
    intlist = [1,2,3,4,5,6,7,8,9,10]
    for num in intlist:
        intSkip.insert(num)

    intSkip.printList()

    # testing removal from the skiplist
    intSkip.remove(1)
    assert(intSkip.find(1) == None)

    # testing the contains function
    assert(intSkip.contains(10) == True)

