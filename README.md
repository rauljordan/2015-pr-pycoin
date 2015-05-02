Pycoin
======
** NOTE: OUR DATA TAKES A WHILE TO LOAD SO IF YOU START THE VISUALIZATION AND SEE NOTHING JUST WAIT FOR A LITTE **

All Our Data is Inside /static/data/

The idea is to encode all cryptocurrencies as nodes in a force layout, where the edges encode an exchange between them. Whenever a user hovers over an edge, a barchart shows up at the bottom showing the recent trades between those two currencies. For example, if we hover over the link between bitcoin and darkcoin, the barchart at the bottom will show all the recent exchanges between those two coins in terms of amount of money with respect to time. 

All of our data has been wrangled and it is inside of /static/data/markets.json which we obtained from the Cryptsy API and the data is encoded as an object where the keys are the currency exchanges. For example, one data item is of the form

{
	"BTC/DOGE": {
		"recenttrades": [
			...
		]
	}
}

Where we see all the recent trades between BTC and DOGEcoin. We have successfully put this together and our layout works as an initial iteration, but it has some bugs that we are fixing as we move forward.

For the force layout, the node data is inside of /static/data/nodes.json where each item is the name of a node and all the nodes associated to it, which will be the links in our layout. 

Read the process book inside of /process_book/ for more information on how this project has been evolving