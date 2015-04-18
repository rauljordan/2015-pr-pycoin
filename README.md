Pycoin
======

The idea is to encode all cryptocurrencies as nodes in a force layout, where the edges encode an exchange between them. Whenever a user hovers over an edge, a barchart shows up at the bottom showing the recent trades between those two currencies. For example, if we hover over the link between bitcoin and darkcoin, the barchart at the bottom will show all the recent exchanges between those two coins in terms of amount of money with respect to time. 

All of our data has been wrangled and it is inside of static/data/markets.json and the data is encoded as an object where the keys are the currency exchanges. For example, one data item is of the form

{
	"BTC/DOGE": {
		"recenttrades": [
			...
		]
	}
}

Where we see all the recent trades between BTC and DOGEcoin. We have successfully put this together and our layout works as an initial iteration, but it has some bugs that we are fixing as we move forward.