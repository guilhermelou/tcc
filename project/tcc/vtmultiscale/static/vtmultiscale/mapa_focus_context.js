var MapaFocusContext = function(div_id, file_map_url, target_map){
    //defining othis for out of scope porpouse
    var othis = this;
    this.target_map = target_map;
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

    d3.select(self.frameElement).style("height", this.height + "px");

    this.g_brush = this.svg.append("g");
    this.brush_scale = d3.scale.linear()
    .domain([0, this.width])
    .range([0, this.width]);

    this.brush = d3.svg.brush();


    this.brush.y(this.brush_scale);
    this.brush.x(this.brush_scale);
    this.brush.extent([[0, 0], [0,0]]);

    this.brush.on('brush', function() {
        othis.brushing.apply(othis, arguments);
    });

    this.brush(this.g_brush);
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

MapaFocusContext.prototype.brushing = function() {
    if (this.target_map){
        var trans_scale = bboxToTransScale(
            [
                this.brush.extent()[0][0],
                this.brush.extent()[0][1],
                this.brush.extent()[1][0],
                this.brush.extent()[1][1]
            ],
            this.width,
            this.height
        );
        var translate = trans_scale[0];
        var min_scale = trans_scale[1];
        this.target_map.g.transition()
            .duration(750)
            .attr(
                "transform",
                "translate("+translate+")scale("+min_scale+")"
        );
    }
};

