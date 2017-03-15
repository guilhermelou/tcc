var getGreaterOrMinor = function(station, key, current_val=null, greater=true){
	station_val = station[key];
    if (current_val == null){
        return station_val;
    }
    else{
        if(greater){
            if(station_val > current_val){
                return station_val;
            }
            else{
                return current_val;
            }
        }
        else{
            if(station_val < current_val){
                return station_val;
            }
            else{
                return current_val;
            }
        }
    }
};

var getBBoxFromStationArray = function(stations){
    greater_long = null;
    greater_lat = null;
    minor_long = null;
    minor_lat = null;
	for(i in stations){
		station = stations[i];
        greater_long = getGreaterOrMinor(station, "long", greater_long, true);
        greater_lat = getGreaterOrMinor(station, "lat", greater_lat, true);
        minor_long = getGreaterOrMinor(station, "long", minor_long, false);
        minor_lat = getGreaterOrMinor(station, "lat", minor_lat, false);
	}
    return [minor_long, greater_lat, greater_long, minor_lat];
};

