

Barchart = function(_parentElement, _marketData, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _marketData;
    this.eventHandler = _eventHandler;
    this.displayData = this.data["MNC/XRP"]["recenttrades"];
    var style = window.getComputedStyle(this.parentElement.node(), null);

    this.margin = {top: 20, right: 50, bottom: 200, left: 60},
    this.width = parseInt(style.getPropertyValue('width')) - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;

    this.dateFormatter = d3.time.format("%d-%H:%M");

    var that = this;
  
    this.times = d3.range(0, that.displayData.length).map(function(i) {
      return that.displayData[i]["time"];
    });

    this.axis_label = "BTC/LTC";

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
Barchart.prototype.initVis = function(){

    // constructs SVG layout
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // creates axis and scales
    this.y = d3.scale.linear()
      .range([this.height,0]);

    this.x = d3.scale.ordinal()
      .rangeRoundBands([0, this.width], .1);


    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .ticks(6)
      .orient("bottom");

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient("left");

    // Add axes visual elements
    this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")");

    this.svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0,0)")
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(this.axis_label);
        

    // filter, aggregate, modify data
    this.wrangleData(null);

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
Barchart.prototype.wrangleData = function(_filterFunction){

    return;


}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
Barchart.prototype.updateVis = function(){


    var that = this;
    // updates scales
    this.x.domain(that.times);
    this.y.domain([0, d3.max(this.displayData, function(d) {
      return d.quantity;
    })]);

    // updates axis
    this.svg.select(".x.axis")
        .call(this.xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "translate(0,0)")
        .attr("transform", function(d){
          return "rotate(-65) translate(0,-10)"
        });

    this.svg.select(".y.axis")
        .call(this.yAxis);


    // Data join
    var bar = this.svg.selectAll(".bar")
        .data(that.displayData);
    // Append new bar groups, if required
    var bar_enter = bar.enter().append("g");

    // Append a rect and a text only for the Enter set (new g)
    bar_enter.append("rect");
    bar_enter.append("text");

  
    // Add attributes (position) to all bars
    bar
      .attr("class", "bar")
      .transition()
      .attr("transform", function(d, i) { 
        return "translate("+that.x(that.times[i])+",0)"; 
      });

    // Remove the extra bars
    bar.exit()
      .remove();

    // Update all inner rects and texts (both update and enter sets)

    bar.select("rect")
      .attr("x", 0)
      .attr("y", function(d,i) {
        return that.y(d.quantity);
      })
      .attr("width", this.x.rangeBand())
      .style("fill", '#008894')
      .transition()
      .attr("height", function(d, i) {
          return that.height - that.y(d.quantity);
      });


}


/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
Barchart.prototype.onSelectionChange = function (name){

    /*
    this.wrangleData(function(d){
      return d.time >= selectionStart && d.time <= selectionEnd;
    });
    */
   this.axis_label = name;
   d3.select('.y.axis').select('text').text(this.axis_label);


   this.displayData = this.data[this.axis_label]["recenttrades"];
   

   this.updateVis();
} 


/**
 * The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*}
 */
Barchart.prototype.filterAndAggregate = function(_filter){

    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    var filter = function(){return true;}
    if (_filter != null){
        filter = _filter;
    }
    var that = this;
}


