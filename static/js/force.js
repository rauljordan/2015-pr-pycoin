/**
 * Force object for Pycoin
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _nodeData -- the node data array
 * @param _eventHandler -- the Eventhandling Object to emit data to (see Task 4)
 * @constructor
 */
Force = function(_parentElement, _nodeData, _eventHandler){

    this.parentElement = _parentElement;
    this.data = _nodeData;
    this.eventHandler = _eventHandler;
    this.displayData = [];
    var style = window.getComputedStyle(this.parentElement.node(), null);

    this.margin = {top: 20, right: 50, bottom: 10, left: 20},
    this.width = parseInt(style.getPropertyValue('width')) - this.margin.left - this.margin.right;
    this.height = 1200 - this.margin.top - this.margin.bottom;

    this.initVis();
    
}


/**
 * Method that sets up the SVG and the variables
 */
Force.prototype.initVis = function(){

    var that = this; 
    
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.graph = {nodes: [], links: []};

	this.nb_nodes = Object.keys(this.data).length;

	this.graph.nodes = Object.keys(this.data).map(function(val, i) {
	   return { 
	    	name:val,
	    	linked_coins:that.data[val]
	   }; 
	});

	var node_names = this.graph.nodes.map(function(val, i) {
		return val.name;
	});


	this.graph.nodes.forEach(function(source_node, i) {

			source_node.linked_coins.forEach(function(coin, d) {

				var end_target = node_names.indexOf(coin);
				that.graph.links.push({"source":i,"target":end_target});

			});
		
	})

	this.link = this.svg.selectAll(".link");
    this.node = this.svg.selectAll(".node");
    this.radius = 10;


	this.svg.selectAll('text.label').attr("fill", "black")

	// Makes the force layout
	this.makeForce(this.graph);
	
};


Force.prototype.makeForce = function(theGraph) {

	var that = this;

	this.tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	  	var src = "img/coins/" + d.name + ".png";
	    return "<strong>Name:</strong> <span style='color:red'>" + d.name + 
	    "</span> <br/> <strong>Traded With:</strong> <span style='color:red'>" + 
	    d.linked_coins.length + " Coins</span> <br> <img src='"+src+"' height='100px' width='100px' style='margin-left:20px;' alt='img/coins/COIN.png'>";
	  });

	this.svg.call(this.tip);


	this.force = d3.layout.force()
	    .size([this.width, this.height])
	    .gravity(0.1)
	    .charge(-300)
	    .linkDistance(80)
	    .on("tick", function() {
	    	  that.link.attr("x1", function(d) { return d.source.x; })
			      .attr("y1", function(d) { return d.source.y; })
			      .attr("x2", function(d) { return d.target.x; })
			      .attr("y2", function(d) { return d.target.y; });

			 
			  that.node.attr("cx", function(d) { 

			  		if (d.name == "BTC") {
			  			d3.select(this).classed("fixed", d.fixed = true);
			  			return d.x;
			  		}
			  		else if (d.name == "LTC") {
			  			d3.select(this).classed("fixed", d.fixed = true);
			  			return d.x;
			  		}
			  		else if (d.name == "XRP") {
			  			d3.select(this).classed("fixed", d.fixed = true);
			  			return d.x;
			  		}			  		
			  		else {
			  			return d.x = Math.max(that.radius, 
			  				Math.min(that.width - that.radius, d.x)); 
			  		}
			  		
			  	})
        		.attr("cy", function(d) { 
        			
			  		if (d.name == "BTC") {
			  			d3.select(this).classed("fixed", d.fixed = true);
			  			return d.y;
			  		}
			  		else if (d.name == "LTC") {
			  			d3.select(this).classed("fixed", d.fixed = true);
			  			return d.y;
			  		}
			  		else if (d.name == "XRP") {
			  			d3.select(this).classed("fixed", d.fixed = true);
			  			return d.y;
			  		}			  		
			  		else {
			  			return d.y = Math.max(that.radius, 
			  				Math.min(that.height - that.radius, d.y)); 
			  		}
        		 
        		});
	    });

	this.drag = this.force.drag()
    	.on("dragstart", this.dragstart);

    this.force
      .nodes(theGraph.nodes)
      .links(theGraph.links)
      .start();

  this.link = this.link.data(theGraph.links)
      .enter().append("line")
      .attr("class", "link");

  this.node = this.node.data(theGraph.nodes)
      .enter()
      .append("circle")
      .attr("class", function(d) {
      	return "node" + " " + d.name;
      })
      .attr("r", this.radius - 0.75)
      .on("dblclick", this.dblclick)
      .call(this.drag)

  	
   this.link.
		on('mouseover', function(d) {

			d3.selectAll(".link").style({'opacity':'0.1'});
			d3.select(this).style({'stroke':'red', 'stroke-width':'15px', 'opacity':'1'});

			var names = {
				first: d.source.name,
				second: d.target.name
			}

			$(that.eventHandler).trigger("selectionChanged", names);
						
				
		})
		.on('mouseout', function(d) {
			
			d3.selectAll('.link').style({
				'stroke':'#008894',
				'stroke-width':'2px',
				'opacity':'1'
			});


		});


	this.node
		.on('mouseover', this.tip.show)
		.on('mouseout',this.tip.hide);



	$('#first-select').change(function(event) {
		var str1 = "";
	    $( "#first-select option:selected" ).each(function() {
	      str1 += $(this).text() + " ";
	    });



	    d3.selectAll('.node').style({"opacity":"0.2", "pointer-events":"none"});

	  	var specific_node = d3.select("." + str1);

		specific_node.style({"opacity":"1", "pointer-events":"all"})

		var linked = specific_node.data()[0]["linked_coins"];

		_.each(linked, function(el) {
			if (el !== "42") {
				d3.select("." + el).style({"opacity":"1", "pointer-events":"all"});
			}
		});


	});
};

/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
Force.prototype.dblclick = function(d) {
  	d3.select(this).classed("fixed", d.fixed = false);

  	d3.selectAll('.node').style({"opacity":"0.2", "pointer-events":"none"});

  	var specific_node = d3.select("." + d.name);

	specific_node.style({"opacity":"1", "pointer-events":"all"})

	var linked = specific_node.data()[0]["linked_coins"];

	_.each(linked, function(el) {
		if (el !== "42") {
			d3.select("." + el).style({"opacity":"1", "pointer-events":"all"});
		}
	});
}

Force.prototype.dragstart = function(d) {
  	d3.select(this).classed("fixed", d.fixed = true);
}


