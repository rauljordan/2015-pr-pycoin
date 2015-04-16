

import requests
import json

class Bitstamp(object):

	"""This class scrapes the Bitstamp API and fetches a JSON object containing
	all important transactions in a chosen time interval"""

	def __init__(self):
		self.data = []


	def transaction_data(self,time):
		"""Fetches the transaction data for a time string given in
		as a human readable time span. Sets self.data to be the JSON
		object fetched as a request

	    :param time: The time to use.
	    :type time: str.
	    """
		# Creates a payload object containing the last hours 
		# passed into the API object
		payload = { 
			"time": time
		}
		# Ues requests to obtain the price data 
		r = requests.get("https://www.bitstamp.net/api/transactions/", data=payload)
		self.data = r.json()

	def write_to_file(self):
		"""Writes to a JSON dump file with the self.data of the 
		current Bitstamp class
	    """
		with open('data/bitstamp.json', 'w') as f:
			json.dump(self.data, f, sort_keys=False,
			 			indent=4, separators=(',', ': '))

if __name__ == '__main__':
	b = Bitstamp()
	b.transaction_data("year")
	b.write_to_file()
	