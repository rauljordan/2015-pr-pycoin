

Volume = function(_parentElement, _marketData, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _marketData;
    this.eventHandler = _eventHandler;
    this.displayData = this.data["MNC/XRP"]["recenttrades"];
    var style = window.getComputedStyle(this.parentElement.node(), null);

    this.margin = {top: 20, right: 50, bottom: 200, left: 60},
    this.width = parseInt(style.getPropertyValue('width')) - this.margin.left - this.margin.right;
    this.height = 420 - this.margin.top - this.margin.bottom;

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
Volume.prototype.initVis = function(){

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
      .tickFormat(function (d, i) {
        return i % 10 == 0 ? d : "";
      })
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
        .text("Trade Volume " + this.axis_label);
        


    // call the update method
    this.updateVis();
}


/**
 * the drawing function - should use the D3 selection, enter, exit
 */
Volume.prototype.updateVis = function(){


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
        .attr("transform", function(d){
          return "rotate(-65) translate(0,15)"
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
Volume.prototype.onSelectionChange = function (names){

   
   

   var first_combination = names.first + '/' + names.second;
   var second_combination = names.second + '/' + names.first;

   if (_.isUndefined(this.data[first_combination])) {
        this.displayData = this.data[second_combination]["recenttrades"];
        this.axis_label = second_combination;
        d3.select('.y.axis').select('text').text(this.axis_label);

        var avg = d3.mean(this.displayData, function(d) { return d.price });
        $('#average-price').text('$' + avg);

        var volume = d3.sum(this.displayData, function(d) { return d.price });
        $('#total-volume').text('$' + volume);

        // Changes the images
        $("#first-image").attr('src', "img/coins/" + names.second + ".png");
        $("#first-name").text(names.second);

        $("#second-image").attr('src', "img/coins/" + names.first + ".png");
        $("#second-name").text(names.first);
        

   }
   else {
        this.displayData = this.data[first_combination]["recenttrades"];
        this.axis_label = first_combination;
        d3.select('.y.axis').select('text').text(this.axis_label);


        var avg = d3.mean(this.displayData, function(d) { return d.price });
        $('#average-price').text('$' + avg);

        var volume = d3.sum(this.displayData, function(d) { return d.price });
        $('#total-volume').text('$' + volume);

        // Changes the images
        $("#first-image").attr('src', "img/coins/" + names.first + ".png");
        $("#first-name").text(names.first);

        $("#second-image").attr('src', "img/coins/" + names.second + ".png");
        $("#second-name").text(names.second);

   }   
   

   this.updateVis();
} 




