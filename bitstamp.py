

from formatter import Formatter
class Bitstamp(Formatter):

	"""This class scrapes the bitstamp API and fetches a JSON object containing
	all important transactions in the past week if possible and writes to a 
	json file that will contain our data. Our data is organized in three
	large JSON files that contain all BITCOIN transaction. Inherits from
	a formatter class that enforces that all JSON files follow the same
	format for d3 manipulation later"""

	def __init__(self, arg):
		super(Bitstamp, self).__init__()
		self.arg = arg

	def scrape_bitstamp(self):
		pass