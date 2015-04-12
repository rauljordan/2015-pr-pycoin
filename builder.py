from skiplistclass import SkipList 
import csv

class Builder(object):
	"""Implements an abstract skiplist builder class"""
	def __init__(self, csvfile, keyindex, keyname):
		self.csvfile = csvfile
		self.keyindex = keyindex
		self.keyname = keyname
		self.skiplist = SkipList()
	
	# parse the csv, and create a list of dictionaries
	# each element has a key of a specific identifier
	# (in our case we chose State Name, Order Name, and Awardee Name
	# and the values are the rest of the columns.

	def build(self):
		# opens the csv file and this is the main method that builds 
		# the skiplist of dicts for population
		dictlist = []
		with open(self.csvfile) as f:
			datafile = csv.reader(f)

			headers = next(datafile)

			for row in datafile:
				# data is a dictionary for each row, in which the key is
				# the important value of interest and the values are another dict called    
				# restofdict
				datadict = {}
				# rest of dict contains all other items of the row except for # state ID
				restofdict = {}

				# builds the restofdict using header names as keys
				# deletes the unnecessary identifier element from the values
				for i in range(len(row)):
					restofdict[headers[i]] = row[i]
					if self.keyname in restofdict: 
						del restofdict[self.keyname]

				datadict[row[self.keyindex]] = restofdict
				# appends to the list of dictionaries
				dictlist.append(datadict)
			# deletes the unnecessary first row of headers in final list
			del dictlist[0]

		return dictlist

# Testing that the module works standalone and inserts appropriately
if __name__ == '__main__':
	# builds a sample skiplist to test
	popobj = Builder('researchgrants.csv', 0, 'Awardee')
	populationlist = popobj.build()
	for item in populationlist:
		popobj.skiplist.insert(item)

	popobj.skiplist.printList()