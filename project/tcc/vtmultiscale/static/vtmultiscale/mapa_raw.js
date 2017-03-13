var MapaRaw = function(div_id, file_map_url){
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

MapaRaw.prototype.ready = function(error, shp) {
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

