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

