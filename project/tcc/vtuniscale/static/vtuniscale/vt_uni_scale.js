var VtUniScale = function(chart, stations){
    var othis = this;
    this.width = 800;
    this.data_set = [];
    // define width of chart in px
    this.chart = visavailChart().width(this.width);
    //d3.select(chart)
    //        .datum(data_set)
    //        .call(this.chart);
};
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getUTCMonth() + 1),
        day = '' + d.getUTCDate(),
        year = d.getUTCFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
VtUniScale.prototype.drawGraph = function () {
    var othis = this;
}

VtUniScale.prototype.dataSetFromStation = function (station) {
    var othis = this;
    data_item = {};
    years_array = [];
    data_item["categories"] = {
            "NULL": {"color": "#000"},
            "CONSISTENT": {"color": "#449d44"},
            "NOT CONSISTENT": {"color": "#d9534d"}
        }
    data_item["measure_html"] = '<button onclick="addChartFromUni('+
            station["id"]+')">'+station["prefix"]+'  [+]</button>'
    data_item["interval_s"] = 3*30.5*24*60*60;
    data_item["data"] = years_array;
    consistency_array = station["consistency"];
    consistency_index = 0;
    for (year=station["year_ini"]; year<=station["year_end"]; year++){
        if (year==consistency_array[consistency_index]){
            consistency_index++;
            years_array.push([""+year+"-01-01", "CONSISTENT"]);
            years_array.push([""+year+"-12-31", "CONSISTENT"]);
            /*
            years_array.push([""+year+"-01-01", 1]);
            years_array.push([""+year+"-12-31", 1]);
            */
        }
        else{
            years_array.push([""+year+"-01-01", "NOT CONSISTENT"]);
            years_array.push([""+year+"-12-31", "NOT CONSISTENT"]);
            /*
            years_array.push([""+year+"-01-01", 0]);
            years_array.push([""+year+"-12-31", 0]);
            */
        }
    }
    return data_item;
}

VtUniScale.prototype.dataSetFromStationComplete = function (station) {
    data_item = {};
    years_array = [];
    YEARS_STATE = {
        NONE:"NONE", CONS:"CONSISTENT", NOT_CONS:"NOT CONSISTENT", NULL:"NULL"};
    years_state = YEARS_STATE.NONE;
    data_item["categories"] = {
            "NULL": {"color": "#000"},
            "CONSISTENT": {"color": "#449d44"},
            "NOT CONSISTENT": {"color": "#d9534d"}
        }
    //data_item["measure"] = station["prefix"];
    data_item["measure_html"] = '<button onclick="testeUni(\''+
            station["id"]+'\')">'+station["prefix"]+'</button>'
    data_item["interval_s"] = 3*30.5*24*60*60;
    data_item["data"] = years_array;
    consistency_array = station["consistency"];
    consistency_index = 0;
    null_days_array = station["null_days_array_str"];
    null_days_index = 0;
    null_day_happen = false;
    var first_date_of_year, last_date_of_year;
    var null_day;
    var last_null_day;
    //console.log(station);
    for (year=station["year_ini"]; year<=station["year_end"]; year++){
        first_date_of_year = new Date(""+year+"-01-01");
        last_date_of_year = new Date(""+year+"-12-31");
        //console.log("YEAR");
        //console.log("FIRST_DATE_YEAR");
        //console.log(first_date_of_year);
        if (year==consistency_array[consistency_index]){
            consistency_index++;
            if (
                    years_state==YEARS_STATE.NONE ||
                    years_state==YEARS_STATE.NOT_CONS
                ){
                years_state = YEARS_STATE.CONS;
                years_array.push([""+year+"-01-01", "CONSISTENT"]);
            }
        }
        else{
            if (
                    years_state==YEARS_STATE.NONE ||
                    years_state==YEARS_STATE.CONS
                ){
                years_state = YEARS_STATE.NOT_CONS;
                years_array.push([""+year+"-01-01", "NOT CONSISTENT"]);
            }
        }
        null_day = new Date(null_days_array[null_days_index]);
        //console.log("CURRENT NULL DAY");
        //console.log(null_day);
        //console.log("NULL_DAYS");
        while(
                null_day >= first_date_of_year &&
                null_day <= last_date_of_year &&
                null_days_index<null_days_array.length
            ){
            //console.log("NULL_DAY_HAPPEN");
            //console.log(null_day);
            last_null_day = new Date(null_days_array[null_days_index]);
            years_array.push([formatDate(null_day), "NULL"]);
            null_day_happen=true;
            null_days_index++;
            if (null_days_index<null_days_array.length){
                null_day = new Date(null_days_array[null_days_index]);
                var after_null_day = new Date(last_null_day);
                after_null_day.setUTCDate(after_null_day.getUTCDate()+1);
                if (after_null_day<null_day){
                    if (years_state==YEARS_STATE.CONS){
                        years_array.push(
                                [formatDate(after_null_day), "CONSISTENT"]);
                    }
                    else{
                        years_array.push(
                                [formatDate(after_null_day), "NOT CONSISTENT"]);
                    }
                }
            }
        }
        /*
        if (null_day_happen){
            console.log("NEXT_NULL_DAY");
            last_null_day.setUTCDate(last_null_day.getUTCDate() + 1);
            console.log(last_null_day);
            null_day_happen=false;
            if (years_state==YEARS_STATE.CONS){
                years_array.push([formatDate(last_null_day), "CONSISTENT"]);
            }
            else{
                years_array.push([formatDate(last_null_day), "NOT CONSISTENT"]);
            }
        }
        */
    }
    //years_array.push(["1997-12-31", "NOT CONSISTENT"]);
    if (years_state==YEARS_STATE.CONS){
        years_array.push([""+station["year_end"]+"-12-31", "CONSISTENT"]);
    }
    else{
        years_array.push([""+station["year_end"]+"-12-31", "NOT CONSISTENT"]);
    }
    //console.log(years_array);
    //console.log(data_item);
    return data_item;
    //return [];
}
