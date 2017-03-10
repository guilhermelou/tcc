var data = [
    {score: 0.2, row: 0, col: 0},
    {score: 0.3, row: 0, col: 1},
    {score: 0.4, row: 0, col: 2},
    {score: 0.4, row: 0, col: 3},
    {score: 0.1, row: 0, col: 4},
    {score: 0.9, row: 0, col: 5},
    {score: 0.5, row: 0, col: 6},
    {score: 0.0, row: 1, col: 0},
    {score: 0.9, row: 1, col: 1},
    {score: 0.8, row: 1, col: 2},
    {score: 0.1, row: 1, col: 3},
    {score: 0.9, row: 1, col: 4},
    {score: 0.5, row: 1, col: 5},
    {score: 0.1, row: 1, col: 6},
    {score: 0.6, row: 2, col: 0},
    {score: 0.3, row: 2, col: 1},
    {score: 0.8, row: 2, col: 2},
    {score: 0.4, row: 2, col: 3},
    {score: 0.1, row: 2, col: 4},
    {score: 0.9, row: 2, col: 5},
    {score: 0.5, row: 2, col: 6},
    {score: 0.6, row: 3, col: 0},
    {score: 0.3, row: 3, col: 1},
    {score: 0.8, row: 3, col: 2},
    {score: -0.4, row: 3, col: 3},
    {score: -0.1, row: 3, col: 4},
    {score: -0.9, row: 3, col: 5},
    {score: -0.5, row: 3, col: 6},
    {score: -0.6, row: 4, col: 0},
    {score: -0.3, row: 4, col: 1},
    {score: -0.8, row: 4, col: 2},
];

//height of each row in the heatmap
//width of each column in the heatmap
var gridSize = 2,
    h = gridSize,
    w = gridSize,
    rectPadding = 10;

var colorLow = 'green', colorMed = 'yellow', colorHigh = 'red';

var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 640 - margin.left - margin.right,
    height = 380 - margin.top - margin.bottom;

var colorScale = d3.scale.linear()
     .domain([-1,  0, 1])
     .range([colorLow, colorMed, colorHigh]);

var svg = d3.select("#heatmap").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var heatMap = svg.selectAll(".heatmap")
    .data(data, function(d) { return d.row + ':' + d.col; })
  	.enter().append("svg:rect")
    .attr("x", function(d) { return d.col * w; })
    .attr("y", function(d) { return d.row * h; })
    .attr("width", function(d) { return w; })
    .attr("height", function(d) { return h; })
    .style("fill", function(d) { return colorScale(d.score); });

