

import requests
import json 

class Cex(object):

	"""This class scrapes the CEX API and fetches a JSON object containing
	all important transactions in a chosen time interval"""

	def __init__(self, url):
		self.url = url
		self.data = requests.get(url).json()

	def write_to_file(self):
		"""Writes to a JSON dump file with the self.data of the 
		current Bitstamp class
	    """
		with open('data/cex.json', 'w') as f:
			json.dump(self.data, f, sort_keys=False,
			 			indent=4, separators=(',', ': '))

if __name__ == '__main__':
	c = Cex('https://cex.io/api/trade_history/GHS/BTC')
	print c.write_to_file()


