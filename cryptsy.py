
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
		# Sets self.data to be a 
		self.data = requests.get(self.url).json()

	def write_to_file(self):
		"""Writes to a JSON dump file with the self.data of the 
		current Bitstamp class
	    """
		with open('data/markets.json', 'w') as f:
			json.dump(self.data, f,sort_keys=False,
			 			indent=4, separators=(',', ': '))

	def markets(self):
		"""Obtains the name of each bitcoin exchange

	    :return list -- list of markets where each element in the
	    list looks like BTC/DOG so that we obtain a list of exchanges
	    of the form ['BTC/DOG', 'DRK/MTC', 'RLP/BTC', ...]
	    """
		return self.data["return"]["markets"].keys()

	def cryptocurrencies(self):
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
			

if __name__ == '__main__':
	b = Cryptsy('http://pubapi.cryptsy.com/api.php?method=marketdatav2')
	b.write_to_file()

