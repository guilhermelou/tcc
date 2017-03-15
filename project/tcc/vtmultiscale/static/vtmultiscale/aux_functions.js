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

var transScaleToBBox = function(x, y, zoom_scale, width, height){
    x = -x;
    y = -y;
    x1 = x>0? (x)/zoom_scale: 0;
    y1 = y>0? (y)/zoom_scale: 0;
    w = (width+x)/zoom_scale - (x>0? x/zoom_scale: 0);
    h = (height+y)/zoom_scale - (y>0? y/zoom_scale: 0);
    return ([x1, y1, w, h]);
};

var bboxToTransScale = function(bbox, width, height){
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
    min_scale = .95/Math.max(dx/width, dy/height);
    // translating the point x to right corner (200/2) minus center on axis
    // x plus scale. Analog for axis y.
    translate = [width/2 - min_scale*point_x, height/2 - min_scale*point_y];
    return ([translate, min_scale]);
};

