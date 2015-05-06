Pycoin
======

Welcome to Pycoin, An Interactive Visualization of Cryptocurrency Markets & Trades.

We are focusing on creating a force layout of all cryptocurrencies that are publicly traded on the internet as a way of visualizing trade and price data and explore connections that are not obvious between these coins from raw data. 

We have chosen Flask to be our backend framework of choice because we have written our scraping programs using Python to interact with external APIs from crypsty.com. 

Our project is hosted using heroku at 

http://pycoin.herokuapp.com

Structure of Our Data
=====================

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


For the force layout, the node data is inside of /static/data/nodes.json where each item is the name of a node and all the nodes associated to it, which will be the links in our layout. 

Project Structure
=================

For our HTML, flask structures all of this inside of a templates/ folder which contains our core layout. The whle website is wrapped around the layout.html file which uses flask templating to dynamically render two different files. When a user goes to the main page, it will render home.html, and when a user goes to /visualization, it will render visualization.html, which contains the core engine that runs our js code. Inside of this file, the view objects are initialized and the data is loaded and passed into them.

Now, for our JS, we have 3 files that contain the logic of our visualization

* force.js
* line.js
* volume.js

All of them are Objects that are initialized following the same format as HW3 with our Vis Objects. Here, we bind an event handler to line and volume to change the data they display whenever something changes in our force layout. Explore the comments on each file to see how all of these are implemented in detail.

External Libraries
==================

We are using jquery, underscore.js, intro.js, d3.js as external javascript libraries located within the vendor/ folder

We also use the materialize.css framework as the basis of our design and layout. All of the cryptocurrency images are located within the static/img/ folder.



