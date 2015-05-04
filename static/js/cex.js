
/**
 * Cex object for Pycoin
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @param _eventHandler -- the Eventhandling Object to emit data to (see Task 4)
 * @constructor
 */
Cex = function(_parentElement, _data, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _data;
    this.eventHandler = _eventHandler;
    this.displayData = this.data["CTM/LTC"]["recenttrades"];
    var style = window.getComputedStyle(this.parentElement.node(), null);


    this.margin = {top: 20, right: 30, bottom: 30, left: 60},
    this.width = parseInt(style.getPropertyValue('width')) - this.margin.left - this.margin.right,
    this.height = 400 - this.margin.top - this.margin.bottom;

    var that = this;
  
    this.times = d3.range(0, that.displayData.length).map(function(i) {
      return new Date(that.displayData[i]["time"]);
    });


    this.axis_label = "LTC/BTC";

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
Cex.prototype.initVis = function(){

    var that = this; // read about the this

    // constructs SVG layout
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


    this.x = d3.time.scale()
              .range([0, this.width]);

    this.y = d3.scale.linear()
        .range([this.height, 0]);

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient("bottom");

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left");

    this.line = d3.svg.line()
        .x(function(d, i) { 
          return that.x(that.times[i]); 
        })
        .y(function(d) { 
          return that.y(d.price); 
        });

    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.xAxis)

    this.svg.append("g")
        .attr("class", "y axis")
        .call(this.yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("USD Bitcoin");


    this.updateVis();
}



/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
Cex.prototype.updateVis = function(){

    var that = this;
    // updates scales
    this.x.domain(d3.extent(that.displayData, function(d,i) { return that.times[i]; }));
    this.y.domain(d3.extent(that.displayData, function(d) { return d.price; }));

    this.svg.append("path")
      .datum(this.displayData)
      .attr("class", "line")
      .attr("d", this.line);

}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
Cex.prototype.onSelectionChange = function (extent){

    this.axis_label = name;
    d3.select('.y.axis').select('text').text(this.axis_label);


   this.displayData = this.data[this.axis_label]["recenttrades"];
   

   this.updateVis();


}


