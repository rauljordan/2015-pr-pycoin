from builder import Builder
from skiplistclass import SkipList  
import csv
import helpers

# filters the skiplist and returns a filtered CSV file
# takes in a skiplist and a dict of parameters to filter 
# and the type of parameter to filter, and the kind of data
# 1 is population, 2 is presidential orders, 3 is grant data

def filter(sklist, postreqdict, param, mainkey, typedata):
    # checks if initial is a POST request
    if param in postreqdict:
        initialvalue = postreqdict[param]

    # searches through the skiplist for all states
    # with that initial
    if typedata == 1:
        filteredlist = sklist.populationfind(initialvalue, param)
    elif typedata == 2:
        filteredlist = sklist.ordersfind(initialvalue)
    else:
        filteredlist = sklist.grantfind(initialvalue, param)

    precsvlist = []

    for elem in filteredlist:

        # creates a single huge dictionary for 
        # the csv dict writer to work well
        singledictionary = {}

        namelist = elem.keys()
        singledictionary[mainkey] = namelist[0]

        importantvals = elem.values()

        # finishes creating the huge dictionary
        singledictionary.update(importantvals[0])

        # creates a list of all these single dictionaries
        # to make it easy for the csv to work
        precsvlist.append(singledictionary)
    
    # creates a unique list free of duplicates
    uniquelist = helpers.remove_duplicate(precsvlist)

    # makes a csv with the uniquelist
    helpers.CSVmaker(uniquelist)
