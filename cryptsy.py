
from formatter import Formatter
import requests
import json

class Cryptsy(Formatter):

	"""This class scrapes the Cryptsy Market API and fetches a JSON object 
	containing all important transactions in the past week if possible 
	and writes to a json file that will contain our data. Our data is 
	organizedin three large JSON files that contain all BITCOIN transaction
	. Inherits froma formatter class that enforces that all JSON files 
	follow the same format for d3 manipulation later"""

	def __init__(self, url):
		super(Cryptsy, self).__init__()
		self.url = url
		self.data = requests.get(self.url).json()

	def write_to_file(self):
		with open('data/markets.json', 'w') as f:
			json.dump(self.data, f,sort_keys=False,
			 			indent=4, separators=(',', ': '))

if __name__ == '__main__':
	b = Cryptsy('http://pubapi.cryptsy.com/api.php?method=marketdatav2')
	print b.write_to_file()