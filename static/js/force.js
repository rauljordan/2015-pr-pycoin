
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

    this.margin = {top: 20, right: 50, bottom: 30, left: 20},
    this.width = parseInt(style.getPropertyValue('width')) - this.margin.left - this.margin.right;
<<<<<<< HEAD
    this.height = 800 - this.margin.top - this.margin.bottom;
=======
    this.height = 1200 - this.margin.top - this.margin.bottom;
>>>>>>> origin/claudia_branch

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


	this.svg.selectAll('text.label').attr("fill", "black")

	// Makes the force layout
	this.makeForce(this.graph);
	

    /*
    this.link = this.svg.selectAll(".link")
              		.data(this.graph.links);

	this.link.enter().append("line")
	    .attr("class", "link")

	this.link.
		on('mouseover', function(d) {
			d3.select(this).style({'stroke':'red', 'stroke-width':'15px'});
			var name = d.source.name + '/' + d.target.name;
			$(that.eventHandler).trigger("selectionChanged", name);
				
		})
		.on('mouseout', function(d) {
			
			d3.select(this).style({'stroke':'#008894','stroke-width':'2px'});
		});

	this.node = this.svg.selectAll(".node")
	              .data(this.graph.nodes)
	              .enter()
	              .append("g").attr("class", "node")
	              
              	  

	this.svg.selectAll('text.label').attr("fill", "black")

	this.force = d3.layout.force()
	    .size([this.width, this.height])
	    .charge(-400)
	    .linkDistance(40)
	    .on('tick', this.tick)


	this.drag = this.force.drag()
    	.on("dragstart", this.dragstart);

   	this.force
      .nodes(this.graph.nodes)
      .links(this.graph.links)
      .start();

    this.node.append("circle")
	    .attr("r", 7)

	this.node.append("text")
				  .attr("dx", ".80em")
				  .attr("dy", ".10em")
		          .text(function(d) { return d.name; })
		          .on('dblclick', this.dblclick)
		          .call('drag');
  	*/
};


Force.prototype.makeForce = function(theGraph) {
	var that = this;
	this.force = d3.layout.force()
	    .size([this.width, this.height])
	    .charge(-100)
	    .linkDistance(300)
	    .on("tick", function() {
	    	  that.link.attr("x1", function(d) { return d.source.x; })
			      .attr("y1", function(d) { return d.source.y; })
			      .attr("x2", function(d) { return d.target.x; })
			      .attr("y2", function(d) { return d.target.y; });

			  that.node.attr("cx", function(d) { return d.x; })
			      .attr("cy", function(d) { return d.y; });
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
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 12)
      .on("dblclick", this.dblclick)
      .call(this.drag)

<<<<<<< HEAD
  this.node.append("text")
	  .attr("dx", ".80em")
	  .attr("dy", ".10em")
      .text(function(d) { return d.name; });
=======
  	
   this.link.
		on('mouseover', function(d) {
			
			d3.selectAll(".link").style({'opacity':'0.1'});
			d3.select(this).style({'stroke':'red', 'stroke-width':'15px', 'opacity':'1'});

			var name = d.source.name + '/' + d.target.name;
		
			$(that.eventHandler).trigger("selectionChanged", name);
						
				
		})
		.on('mouseout', function(d) {
			
			d3.selectAll('.link').style({
				'stroke':'#008894',
				'stroke-width':'2px',
				'opacity':'1'
			});
>>>>>>> origin/claudia_branch


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

