var MapaFocusContext = function(div_id, file_map_url){
    //defining othis for out of scope porpouse
    var othis = this;
    // Define map size on screen
    this.width = 200;
    this.height = 200;
    this.svg = d3.select(div_id).append("svg")
        .attr("width", this.width)
        .attr("height", this.height);

    this.g = this.svg.append("g")
        .attr("class", "RdYlGn");
    this.g_brush = this.svg.append("g");
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

    d3.select(self.frameElement).style("height", this.height + "px");
};

MapaFocusContext.prototype.ready = function(error, shp) {
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

};

MapaFocusContext.prototype.transScaleToBBox = function(x, y, zoom_scale){
    x = -x;
    y = -y;
    x1 = x>0? (x)/zoom_scale: 0;
    y1 = y>0? (y)/zoom_scale: 0;
    w = (200+x)/zoom_scale - (x>0? x/zoom_scale: 0);
    h = (200+y)/zoom_scale - (y>0? y/zoom_scale: 0);
    return ([x1, y1, w, h]);
};

MapaFocusContext.prototype.bboxToTransScale = function(bbox){
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
