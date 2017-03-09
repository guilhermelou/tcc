var Station = function(station){
    keys = Object.keys(station);
    for (i in keys){
        key = keys[i];
        this[key] = station[key];
    }
};

Station.prototype.getLatLong = function() {
    return [this.lat, this.long];
};

Station.prototype.getLongLat = function() {
    return [this.long, this.lat];
};

var Section = function(section){
    keys = Object.keys(section);
    for (i in keys){
        key = keys[i];
        this[key] = section[key];
    }
};

var SubSection = function(sub_section){
    keys = Object.keys(sub_section);
    for (i in keys){
        key = keys[i];
        this[key] = sub_section[key];
    }
};

var Mapa = function(div_id, file_map_url, stations, sections, sub_sections){
    //defining othis for out of scope porpouse
    var othis = this;
    //defining the list of stations
    this.stations = stations;
    this.sections = sections;
    this.sub_sections = sub_sections;
    // Define map size on screen
    this.width = 200;
    this.height = 200;
    this.svg = d3.select(div_id).append("svg")
        .attr("width", this.width)
        .attr("height", this.height);

    this.g = this.svg.append("g");
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


    this.g.selectAll("circle")
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
        .attr("r", "0.1px")
        .attr("fill", "red")
        .on("mouseover", function(data, index, base){
                return othis.over.apply(othis, [data, index, base, this]);
        });
    this.g.selectAll(".section")
        .data(this.sections).enter()
        .append("rect")
        .attr("class", "section")
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
        }).attr("fill", function(d){
            return "#044B94";
        }).attr("fill-opacity",function(d){
            return 0.4;
        });
};

// What to do when zooming
Mapa.prototype.zoomed = function () {
    this.g.style("stroke-width", 2 / d3.event.scale + "px");
    //g.selectAll("circle").attr("r",  0.1*d3.event.scale + "px")
    this.g.attr(
            "transform",
            "translate(" + d3.event.translate+
            ")scale(" + d3.event.scale +
            ")"
    );
};

Mapa.prototype.over = function(data, index, base, obj) {
    console.log("Objeto")
    console.log(this);
    console.log(obj);
    console.log(obj.__data__);
    d3.select(obj).style("fill", "green");
};
