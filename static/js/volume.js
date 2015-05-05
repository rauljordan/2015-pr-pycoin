

Volume = function(_parentElement, _marketData, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _marketData;
    this.eventHandler = _eventHandler;
    this.displayData = this.data["MNC/XRP"]["recenttrades"];
    var style = window.getComputedStyle(this.parentElement.node(), null);

    this.margin = {top: 0, right: 0, bottom: 70, left: 50},
    this.width = parseInt(style.getPropertyValue('width')) - this.margin.left - this.margin.right;
    this.height = 350 - this.margin.top - this.margin.bottom;

    var that = this;
  
    this.times = d3.range(0, that.displayData.length).map(function(i) {
      return that.displayData[i]["time"];
    }).reverse();

    this.firstDateFormatter = d3.time.format("%Y-%m-%d");
    this.lastDateFormatter = d3.time.format("%B");

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
Volume.prototype.initVis = function(){

    var that = this;

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
        var dt = new Date(d);

        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        if (i == 0) {
          
          return "First Day " + monthNames[dt.getMonth()] + " " + dt.getDate();
        }
        else if (i == 150) {
          return "Last Day " + monthNames[dt.getMonth()] + " " + dt.getDate();
        }
        else {
          return "";
        }
      })
      .orient("bottom");

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient("left")
      .tickFormat(d3.format("s"));

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
        .text("Tot. Traded Per Day in USD");
        
    // call the update method
    this.updateVis();
}


/**
 * the drawing function - should use the D3 selection, enter, exit
 */
Volume.prototype.updateVis = function(){


    var that = this;
    // updates scales
    this.x.domain(this.times);
    this.y.domain([0, d3.max(this.displayData, function(d) {
      return d.total*1.5;
    })]);

    // updates axis
    this.svg.select(".x.axis")
        .attr("transform", "translate(0," + (that.height) + ")")
        .call(this.xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", function(d, i){
          if (i == 0) {
            return "rotate(0) translate(120,15)";
          }
          else {
            return "rotate(0) translate(20,15)";
          }
          
        });

    this.svg.select(".y.axis")
        .call(this.yAxis);


    // Data join
    this.bar = this.svg.selectAll(".bar")
        .data(that.displayData);

    // Append new bar groups, if required
    this.bar_enter = this.bar.enter().append("g");

    // Append a rect and a text only for the Enter set (new g)
    this.bar_enter.append("rect");
    this.bar_enter.append("text");

  
    // Add attributes (position) to all bars
    this.bar
      .attr("class", "bar")
      .transition()
      .attr("transform", function(d, i) { 
        return "translate("+that.x(that.times[i])+",0)"; 
      });


    // Remove the extra bars
    this.bar.exit()
      .remove();

    // Update all inner rects and texts (both update and enter sets)

    this.bar.select("rect")
      .attr("x", 0)
      .attr("y", function(d,i) {
        return that.y(d.total);
      })
      .attr("width", this.x.rangeBand())
      .style("fill", '#008894')
      .attr("height", function(d, i) {
          return that.height - that.y(d.total);
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
     

        var avg = d3.mean(this.displayData, function(d) { return d.price });
        var format_avg = d3.format(".15f")
        $('#average-price').text('$' + format_avg(avg));

        var volume = d3.sum(this.displayData, function(d) { return d.price });
        var format_volume = d3.format(".15f")
        $('#total-volume').text('$' + format_volume(volume));

        // Changes the images
        $("#first-image").attr('src', "img/coins/" + names.second + ".png");
        $("#first-name").text(names.second);

        $("#second-image").attr('src', "img/coins/" + names.first + ".png");
        $("#second-name").text(names.first);
        

   }
   else {
        this.displayData = this.data[first_combination]["recenttrades"];
   

        var avg = d3.mean(this.displayData, function(d) { return d.price });
        var format_avg = d3.format(".15f")
        $('#average-price').text('$' + format_avg(avg));

        var volume = d3.sum(this.displayData, function(d) { return d.price });
        var format_volume = d3.format(".15f")
        $('#total-volume').text('$' + format_volume(volume));

        // Changes the images
        $("#first-image").attr('src', "img/coins/" + names.first + ".png");
        $("#first-name").text(names.first);

        $("#second-image").attr('src', "img/coins/" + names.second + ".png");
        $("#second-name").text(names.second);
   }   
   

   this.updateVis();
} 


