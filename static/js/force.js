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
			  			return d.x = 225;
			  		}
			  		else if (d.name == "LTC") {
			  			d3.select(this).classed("fixed", d.fixed = true);
			  			return d.x = 250;
			  		}
			  		else if (d.name == "XRP") {
			  			d3.select(this).classed("fixed", d.fixed = true);
			  			return d.x = 275;
			  		}			  		
			  		else {
			  			return d.x = Math.max(that.radius, 
			  				Math.min(that.width - that.radius, d.x)); 
			  		}
			  		
			  	})
        		.attr("cy", function(d) { 
        			
			  		if (d.name == "BTC") {
			  			d3.select(this).classed("fixed", d.fixed = true);
			  			return d.y = 150;
			  		}
			  		else if (d.name == "LTC") {
			  			d3.select(this).classed("fixed", d.fixed = true);
			  			return d.y = 50;
			  		}
			  		else if (d.name == "XRP") {
			  			d3.select(this).classed("fixed", d.fixed = true);
			  			return d.y = 100;
			  		}			  		
			  		else {
			  			return d.y = Math.max(that.radius, 
			  				Math.min(that.width - that.radius, d.y)); 
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
      .attr("class", "node")
      .attr("r", this.radius - 0.75)
      .on("dblclick", this.dblclick)
      .call(this.drag)

  	
   this.link.
		on('mouseover', function(d) {

			d3.selectAll(".link").style({'opacity':'0.1'});
			d3.select(this).style({'stroke':'red', 'stroke-width':'15px', 'opacity':'1'});

			var name = d.source.name + '/' + d.target.name;
		
			$(that.eventHandler).trigger("selectionChanged", name);


			$("#img1").html('<h1>Hello World </h1>');
			$("#img2").html('');

			var src1 = "{{url_for('static', filename='img/coins/" + d.source.name + ".png')}}";
			var src2 = "{{url_for('static', filename='img/coins/" + d.target.name + ".png')}}";
			$('#img1').html('<img src=' + src1 + ' class="activator">')
			$('#img2').html('<img src=' + src2 + ' class="activator">')

						
				
		})
		.on('mouseout', function(d) {
			
			d3.selectAll('.link').style({
				'stroke':'#008894',
				'stroke-width':'2px',
				'opacity':'1'
			});


		});

	
};

/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
Force.prototype.dblclick = function(d) {
  	d3.select(this).classed("fixed", d.fixed = false);
}

Force.prototype.dragstart = function(d) {
  	d3.select(this).classed("fixed", d.fixed = true);
}


Force.prototype.tick = function() {
  this.link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  this.node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
};