var roundsArray = ["Round 1", "Round 2", "Round 3", "Round 4", "Round 5", "Round 6", "Round 7", "Round 8", "Round 9", "Round 10", "Round 11"];
var maxRoundsToDisplay = (roundsArray.length -1); // I'm not sure why I have to use this number, since you can see that it doesn't match the roundsArray
var secondsPerRound = 180;
function totalTime (numOfRounds, roundTime) {
  // http://stackoverflow.com/questions/9640266/convert-hhmmss-string-to-seconds-only-in-javascript
  a = parseInt(numOfRounds -1) * secondsPerRound; // -1 Because Round 1 is the zero start
  roundTimeArray = roundTime.split(":");
  roundMinutesInSeconds = parseInt(roundTimeArray[0] * 60);
  roundAdditionalSeconds = parseInt(roundTimeArray[1]);
  b = roundMinutesInSeconds + roundAdditionalSeconds;
  return (a + b); 
}
var height = 500;
var width = 600;
var padding = 75;

var svg = d3.select('#viz-wrapper')
    .append('svg')
    .attr('height', height + padding)
    .attr('width', width + padding * 2);

var viz = svg.append('g')
    .attr('id', 'viz')
    .attr('transform', 
        'translate(' + padding + ',0)');

var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

d3.csv('./tyson_full_ko_wins.csv', function(data) {
  var yScale = d3.scale.ordinal()
      .rangeRoundBands([height, 0], .5)
      .domain(data.map(function(d) {return d.FIGHT_DATE}));
  var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");
  viz.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var xScale = d3.scale.linear()
      .range([0, width])
      .domain([0, (secondsPerRound * maxRoundsToDisplay)]);
  var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .ticks(10);
  viz.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, "+ height + ")")
      .call(xAxis);
  // tooltips: http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
  viz.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", function(d) { return yScale(d.FIGHT_DATE) })
      .attr("x", 0)
      .attr("width", function(d) { return xScale(totalTime(d.ROUND, d.ROUND_TIME)) })
      .attr("height", yScale.rangeBand())
      .on("mouseenter", function(d){
        bar = d3.select(this);
        bar.style('fill', 'blue');
        div.transition()        
        .duration(200)      
        .style("opacity", .9); 
        div.html(d.TYPE + "'d " + d.OPPONENT_NAME + " on " + (d.FIGHT_DATE) + "<br>" + "Round " + d.ROUND + " Time " + d.ROUND_TIME)  
           .style("left", (d3.event.pageX) + "px")     
           .style("top", (d3.event.pageY - 28) + "px");  
      })
      .on("mouseleave", function(d){
        bar = d3.select(this);
        bar.style('fill', '#990000');
        div.transition()        
        .duration(500)      
        .style("opacity", 0); 
      });

});
 
// The rounds scale is different than the xScale
// xScale accurately maps the length of the rounds to the width of
// the viz, and the roundsScale evenly chops up that same width into 'rounds'
// The stylesheet hides the scale
var roundsScale = d3.scale.ordinal()
    .rangeRoundPoints([0, width])
    .domain(roundsArray);
var roundsAxis = d3.svg.axis()
    .scale(roundsScale)
    .orient("bottom")
    .tickSize(-height, -0, -0); // this tickSize makes the vertical grid lines
viz.append("g")
    .attr("class", "rounds axis")
    .attr("transform", "translate(0, "+ height + ")")
    .call(roundsAxis)
    .selectAll('text')
    .attr("transform", function() {
      return "rotate(-50)" })
    .attr("dx", "-5px")
    .attr("dy", "35px");
