

import requests
import json

class Bitstamp(object):

	"""This class scrapes the Bitstamp API and fetches a JSON object containing
	all important transactions in the past week if possible and writes to a 
	json file that will contain our data. Our data is organized in three
	large JSON files that contain all BITCOIN transaction. Inherits from
	a formatter class that enforces that all JSON files follow the same
	format for d3 manipulation later"""

	def __init__(self, url):
		super(Bitstamp, self).__init__()
		self.url = url
		self.data = {}


	def transaction_data(self,time):
		"""Obtains the price data with respect to time where time is a
		string parameter given in as a string representing last hours. 
		Default value returns the price data for the last 24 hours
		@param time 
		@return dictionary
		"""
		# Creates a payload object containing the last hours 
		# passed into the API object
		payload = { 
			"time": time
		}
		# Ues requests to obtain the price data 
		r = requests.get("https://www.bitstamp.net/api/transactions/", data=payload)
		self.data = r.json()

	# writes the bitcoin JSON data into a dump file
	def write_to_file(self):
		with open('data/bitstamp.json', 'w') as f:
			json.dump(self.data, f, sort_keys=False,
			 			indent=4, separators=(',', ': '))

if __name__ == '__main__':
	b = Bitstamp('none')
	b.transaction_data("year")
	b.write_to_file()
	