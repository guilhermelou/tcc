var day = d3.time.format("%w"), // day of the week
    day_of_month = d3.time.format("%e"), // day of the month
    day_of_year = d3.time.format("%j"),
    week = d3.time.format("%U"), // week number of the year
    only_month = d3.time.format("%m"), // month number
    percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");
    format_month = d3.time.format("%Y-%m");
    format_year= d3.time.format("%Y");
var color = d3.scale.quantize()
    .domain([0,300])
    .range(d3.range(11).map(function(d) {  return "q" + d + "-11"; }));
var color_month = d3.scale.quantize()
    .domain([0,300])
    .range(d3.range(11).map(function(d) {  return "q" + d + "-11"; }));
var color_year = d3.scale.quantize()
    .domain([0,50])
    .range(d3.range(11).map(function(d) {  return "q" + d + "-11"; }));
var color_station = d3.scale.quantize()
    .domain([0,50])
    .range(d3.range(11).map(function(d) {  return "q" + d + "-11"; }));
var color_section = d3.scale.quantize()
    .domain([0,50])
    .range(d3.range(11).map(function(d) {  return "q" + d + "-11"; }));
