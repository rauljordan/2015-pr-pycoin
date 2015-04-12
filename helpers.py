from builder import Builder
import csv

################# DATA MINER ####################
#                                               #
#      Makes a dataminer for government data    #
#      that outputs useful CSV files for easy   #
#      data manipulation                        #
#################################################   

# Helper Functions

# makes the population skiplist
def makePopulationlist():
    
    popobj = Builder('population.csv', 4, 'NAME')
    populationlist = popobj.build()
    for item in populationlist:
        popobj.skiplist.insert(item)

    return popobj.skiplist

# makes the presidential documents skiplist
def makePresidentialOrderlist():
   
    ordersobj = Builder('presidentialdocuments.csv', 1, 'title')
    orderslist = ordersobj.build()
    for item in orderslist:
        ordersobj.skiplist.insert(item)

    return ordersobj.skiplist


# makes the research grants skiplist
def makeGrantlist():
    grantobj = Builder('researchgrants.csv', 0, 'Awardee')
    grantlist = grantobj.build()

    for item in grantlist:
        grantobj.skiplist.insert(item)

    return grantobj.skiplist

# removes all duplicates from a list of dictionaries
def remove_duplicate(dictlist):
    output = []
    for x in dictlist:
        if x not in output:
            output.append(x)
    return output


# handy function for making a csv from a list of dicts
def CSVmaker(uniquelist):
    
    # gets the rownames from any element of the list of dicts
    rownames = uniquelist[0].keys()
    
    with open('static/filtereddata.csv', 'wb') as f:
        writervar = csv.writer(f, dialect='excel')
        writervar.writerow(rownames)

        for row in uniquelist:
            valtowrite = row.values()
            writervar.writerow(valtowrite)


# Comprehensive tests for helper functions
if __name__ == '__main__':

    # testing the skiplist maker
    skiplistone = makePopulationlist()
    skiplistone.printList()

    skiplisttwo = makePresidentialOrderlist()
    skiplisttwo.printList()

    skiplistthree = makeGrantlist()
    skiplistthree.printList()

    # builds a simple dictionary list to test the next function
    testdict = [{1 : 'a'}, {1 : 'a'}, {2 : 'b'}]

    assert(remove_duplicate(testdict) == [{1 : 'a'}, {2 : 'b'}])



