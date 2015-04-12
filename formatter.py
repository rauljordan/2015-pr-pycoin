
class Formatter(object):
	"""Base formatter class that enforces datatype to
	be a specific JSON object according to a schema"""
	def __init__(self):
		self.schema = {
			'item': 'item'
		}
		