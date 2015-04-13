

from formatter import Formatter
import requests
import json 

class Cex(Formatter):

	"""This class scrapes the cex API and fetches a JSON object containing
	all important transactions in the past week if possible and writes to a 
	json file that will contain our data. Our data is organized in three
	large JSON files that contain all BITCOIN transaction. Inherits from
	a formatter class that enforces that all JSON files follow the same
	format for d3 manipulation later"""

	def __init__(self, url):
		super(Cex, self).__init__()
		self.url = url
		self.data = requests.get(url).json()


	def price_data(self, time):
		"""Obtains the price data with respect to time where time is a
		string parameter given in as a string representing last hours. 
		Default value returns the price data for the last 24 hours
		@param time 
		@return dictionary
		"""
		# Creates a payload object containing the last hours 
		# passed into the API object
		payload = { 
			"lastHours": time, 
			"maxRespArrSize": 1000 
		}
		# Ues requests to obtain the price data 
		r = requests.post("https://cex.io/api/price_stats/BTC/USD", data=payload)
		return r

	def write_to_file(self):
		with open('data/cex.json', 'w') as f:
			json.dump(self.data, f, sort_keys=False,
			 			indent=4, separators=(',', ': '))

if __name__ == '__main__':
	c = Cex('https://cex.io/api/trade_history/GHS/BTC')
	print c.write_to_file()


