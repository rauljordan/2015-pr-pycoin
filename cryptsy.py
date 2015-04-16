
import requests
import json

class Cryptsy(object):

	"""This class scrapes the Cryptsy API and fetches a JSON 
	object containing all the market data for each exchange 
	between cryptocurrencies. Contains a method that writes
	to a JSON dump file."""

	def __init__(self, url):
		"""Initializes Cryptsy object

	    :param url: The API Url object.
	    :type time: str.

	    The self.data object has the type
	    {"return": [{markets:[...]}], "success":1}
	    where the markets array is what interests us.
	    """
		self.url = url
		self.data = requests.get(self.url).json()
		self.formatted_data = self.data["return"]["markets"]
		self.nodes = {}
		self.crypto_pairs = []


	def write_to_file(self):
		"""Writes to a JSON dump file with the self.data of the 
		current Bitstamp class
	    """
		with open('static/data/markets.json', 'w') as f:
			json.dump(self.formatted_data, f,sort_keys=False,
			 			indent=4, separators=(',', ': '))

	def markets(self):
		"""Obtains the name of each bitcoin exchange

	    :return list -- list of markets where each element in the
	    list looks like BTC/DOG so that we obtain a list of exchanges
	    of the form ['BTC/DOG', 'DRK/MTC', 'RLP/BTC', ...]
	    """
		return self.formatted_data.keys()

	def cryptocurrency_names(self):
		"""Obtains a set of unique cryptocurrency names in our market 
		data

	    :return set -- set of unique cryptocurrency names. Such as 
	    BTC, DOG, LTE, etc...
	    """
		keys = self.markets()
		coins = set()
		for key in keys:
			coins.update(key.split('/'))
		return coins

	def cryptocurrency_pairs(self):
		keys = self.markets()
		pairs = []
		for key in keys:
			pairs.append(key.split('/'))
		self.crypto_pairs = pairs
	
	def build_nodes(self):
		for coin in self.cryptocurrency_names():
			self.nodes[coin] = set()

		# Now append the coins it is linked to


if __name__ == '__main__':
	b = Cryptsy('http://pubapi.cryptsy.com/api.php?method=marketdatav2')
	b.build_nodes()
	print b.cryptocurrency_pairs()

