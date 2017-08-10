
var Mapa = function(div_id, file_map_url, stations, sections, sub_sections){
    //defining othis for out of scope porpouse
    var othis = this;
    //defining the list of stations
    this.stations = stations;
    this.sections = sections;
    this.sub_sections = sub_sections;
    // Declarating future brush_map
    this.brush_map = null;
    // Define map size on screen
    this.width = 200;
    this.height = 200;
    this.svg = d3.select(div_id).append("svg")
        .attr("class", "mapa")
        .attr("width", this.width)
        .attr("height", this.height);

    this.g = this.svg.append("g")
        .attr("class", "RdYlGn");
    // Align center of Sao Paulo to center of map
    this.projection = d3.geo.mercator()
    .scale(1100)
    .center([-48, -22])
    .translate([this.width / 2, this.height / 2]);

    this.path = d3.geo.path()
    .projection(this.projection);

    // Load data (asynchronously)
    d3_queue.queue()
    .defer(d3.json, file_map_url)
    .await(function(){
            othis.ready.apply(othis, arguments);
    });

    this.zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 30])
    .on("zoom", function(){
            othis.zoomed.apply(othis, arguments);
    });

    this.svg.call(this.zoom) // delete this line to disable free zooming
    .call(this.zoom.event);

    d3.select(self.frameElement).style("height", this.height + "px");
    d3.select("svg").on("mousedown.log", function() {
    });

    console.log("Our tooltip");
    this.tooltip = d3.select("body")
    .append("div").attr("id", "tooltip_map")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("a simple tooltip");
};

Mapa.prototype.ready = function(error, shp) {
    if (error) throw error;
    var othis = this;
    // Extracting polygons and contours
    var states = topojson.feature(shp, shp.objects.states);
    var states_contour = topojson.mesh(shp, shp.objects.states);
    // Desenhando estados
    this.g.selectAll(".estado")
        .data(states.features)
        .enter()
        .append("path")
        .attr("class", "state")
        .attr("d", this.path);

    this.g.append("path")
        .datum(states_contour)
        .attr("d", this.path)
        .attr("class", "state_contour");

    this.section_rects = this.g.selectAll(".section")
        .data(this.sections).enter()
        .append("rect")
        .attr("class", function(d) {
            return "section " + color_section(d["average"]);
        })
        .attr("x", function(d){
            bbox = d['bbox'];
            up_corner = [bbox[0], bbox[1]];
            return othis.projection(up_corner)[0];
        })
        .attr("y", function(d){
            bbox = d['bbox'];
            up_corner = [bbox[0], bbox[1]];
            return othis.projection(up_corner)[1];
        })
        .attr("width", function(d){
            bbox = d['bbox'];
            up_corner = othis.projection([bbox[0], bbox[1]]);
            bt_corner = othis.projection([bbox[2], bbox[3]]);
            width = up_corner[0] - bt_corner[0]
            return Math.abs(width);
        })
        .attr("height", function(d){
            bbox = d['bbox'];
            up_corner = othis.projection([bbox[0], bbox[1]]);
            bt_corner = othis.projection([bbox[2], bbox[3]]);
            height = up_corner[1] - bt_corner[1];
            return Math.abs(height);
        }).attr("fill-opacity",function(d){
            return 0.4;
        });

    this.station_circles = this.g.selectAll("circle")
        .data(this.stations).enter()
        .append("circle")
        .attr("cx", function (d) {
                var station = new Station(d);
                return othis.projection(station.getLongLat())[0];
        })
        .attr("cy", function (d) {
                var station = new Station(d);
                return othis.projection(station.getLongLat())[1];
        })
        .attr("r", "0.5px")
        .attr("class", function(d) {
            return "station " + color_station(d["average"]);
        })
        .on("mouseover", function(data, index, base){
                return othis.over.apply(othis, [data, index, base, this]);
        })
        .on("mouseout", function(data, index, base){
                return othis.out.apply(othis, [data, index, base, this]);
        })
        .on("click", function(data, index, base){
                return othis.click.apply(othis, [data, index, base, this]);
        });
};

Mapa.prototype.transScaleToBBox = function(x, y, zoom_scale){
    x = -x;
    y = -y;
    x1 = x>0? (x)/zoom_scale: 0;
    y1 = y>0? (y)/zoom_scale: 0;
    w = (200+x)/zoom_scale - (x>0? x/zoom_scale: 0);
    h = (200+y)/zoom_scale - (y>0? y/zoom_scale: 0);
    return ([x1, y1, w, h]);
};

Mapa.prototype.bboxToTransScale = function(bbox){
    x = bbox[0];
    y = bbox[1];
    w = bbox[2];
    h = bbox[3];
    // width
    dx = w-x;
    //height
    dy = h-y;
    //center axis x
    point_x = (x + w)/2;
    //center axis y
    point_y = (y + h)/2;
    //getting scale based on max value between width and height
    //but the scale will be the shortest zoom in
    min_scale = .95/Math.max(dx/200, dy/200);
    // translating the point x to right corner (200/2) minus center on axis
    // x plus scale. Analog for axis y.
    translate = [200/2 - min_scale*point_x, 200/2 - min_scale*point_y];
    return ([translate, min_scale]);
};

Mapa.prototype.addBrushMap = function (brush_map) {
    this.brush_map = brush_map;
};
// What to do when zooming
Mapa.prototype.zoomed = function () {
    this.g.style("stroke-width", 2 / d3.event.scale + "px");
    this.g.attr(
            "transform",
            "translate(" + d3.event.translate+
            ")scale(" + d3.event.scale +
            ")"
    );

    if(this.brush_map){
        bbox = transScaleToBBox(
                d3.event.translate[0],
                d3.event.translate[1],
                d3.event.scale,
                this.width,
                this.height
        );
        this.brush_map.g_brush.selectAll(".extent")
            .attr("x", bbox[0])
            .attr("y", bbox[1])
            .attr("width", bbox[2])
            .attr("height", bbox[3]);
    }
	//test_extent(d3.event.translate[0], d3.event.translate[1], d3.event.scale);
    //this.g.selectAll("circle").attr("r",""+0.5*(1/(d3.event.scale*0.7))+"px");
};

Mapa.prototype.over = function(data, index, base, obj) {
    this.tooltip.style("visibility", "visible");
    var purchase_text = "<p>" + obj.__data__["prefix"] +"</p>";
    this.tooltip.transition()
                .duration(200)
                .style("opacity", .9);
    this.tooltip.html(purchase_text)
                .style("left", (d3.event.pageX)+30 + "px")
                .style("top", (d3.event.pageY) + "px");
    d3.select(obj).attr("r", "5px");
};

Mapa.prototype.out = function(data, index, base, obj) {
    this.tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    d3.select(obj).attr("r", "0.5px");
};

Mapa.prototype.click = function(data, index, base, obj) {
    addChart(obj.__data__);
};

