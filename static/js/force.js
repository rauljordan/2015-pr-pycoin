
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

    this.margin = {top: 20, right: 50, bottom: 30, left: 60},
    this.width = parseInt(style.getPropertyValue('width')) - this.margin.left - this.margin.right;
    this.height = 800 - this.margin.top - this.margin.bottom;

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

	this.graph.nodes.forEach(function(source_node, i) {
	  that.graph.nodes.forEach(function(end_node, j) {
	    if (_.contains(source_node.linked_coins, end_node.name) && i != j) {
	    	that.graph.links.push({"source": i, "target": j})
	    }

	  })
	})

	

    
    this.link = this.svg.selectAll(".link")
              		.data(this.graph.links);

	this.link.enter().append("line")
	    .attr("class", "link")

	this.node = this.svg.selectAll(".node")
	              .data(this.graph.nodes)
	              .enter()
	              .append("g").attr("class", "node")
	              .on("mouseover", function(d) {
	              	alert(d.name);
	              	console.log(d.linked_coins);
	              })
              	  

	this.node.append("circle")
	    .attr("r", 7)

	this.force = d3.layout.force()
	    .size([this.width, this.height])
	    .charge(-50)
	    .linkDistance(10);

	this.forceLayout();

	this.force
	    .on("tick", this.graph_update(0))
	    .on("start", function(d) {})
	    .on("end", function(d) {})
	    .start();

    
};


/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
Force.prototype.forceLayout = function(){

    this.force.nodes(this.graph.nodes)
      .links(this.graph.links)
      .start();

};

Force.prototype.graph_update = function(duration) {

	this.link.transition().duration(duration)
      .attr("x1", function(d) { return d.target.x; })
      .attr("y1", function(d) { return d.target.y; })
      .attr("x2", function(d) { return d.source.x; })
      .attr("y2", function(d) { return d.source.y; });

  	this.node.transition().duration(duration)
      .attr("transform", function(d) {
        return "translate("+d.x+","+d.y+")"; 
      });
};

Force.prototype.tick = function(d) {
	this.graph_update(0);
};


