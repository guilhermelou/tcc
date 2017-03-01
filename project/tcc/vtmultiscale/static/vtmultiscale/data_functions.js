/**
 * This method is used to get the year object inside a data
 * dictionary using the date parameter to find it
 * @param {Date} d - This param is used to find the year of this date
 * @param {Array} data - The year will be found in this param
 * @return {Dictionary} The proper year object from data
 */
var getYearByDate = function(d, data){
    year_date = (new Date(d)).getUTCFullYear();
    for (i in data){
        year_obj = data[i];
        year = year_obj["year"];
        if (year_date == year){
            return year_obj;
        }
    }
    return null;
}

/**
 * This method is used to get the month object inside a data
 * dictionary using the date parameter to find it
 * @param {Date} d - This param is used to find the month of this date
 * @param {Array} data - The month will be found in this data_set
 * @return {Dictionary} The proper month object from data
 */
var getMonthByDate = function(d, data){
    year_date = (new Date(d)).getUTCFullYear();
    month_index = (new Date(d)).getUTCMonth();
    for (i in data){
        year_obj = data[i];
        year = year_obj["year"];
        if (year_date == year){
            months = year_obj["months"];
            return months[month_index];
        }
    }
    return null;
}

/**
 * This method is used to get the day object inside a data
 * dictionary using the date parameter to find it
 * @param {Date} d - This param is used to find the day of this date
 * @param {Array} data - The day will be found in this data_set
 * @return {Dictionary} The proper day object from data
 */
var getDayByDate = function(d, data){
    year_date = (new Date(d)).getUTCFullYear();
    month_index = (new Date(d)).getUTCMonth();
    day_index = (new Date(d)).getUTCDate()-1;
    for (i in data){
        year_obj = data[i];
        year = year_obj["year"];
        if (year_date == year){
            months = year_obj["months"];
            month = months[month_index];
            days = month["days"];
            return days[day_index];
        }
    }
    return null;
}

