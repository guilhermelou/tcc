/**
 * This method is used to get the year object inside a data
 * dictionary using the date parameter to find it
 * @param {Date} date - This param is used to find the year of this date
 * @param {Array} data - The year will be found in this param
 * @return {Dictionary} The proper year object from data
 */
var getYearByDate = function(date, data){
    year_date = (new Date(date)).getUTCFullYear();
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
 * @param {Date} date - This param is used to find the month of this date
 * @param {Array} data - The month will be found in this data_set
 * @return {Dictionary} The proper month object from data
 */
var getMonthByDate = function(date, data){
    year_date = (new Date(date)).getUTCFullYear();
    month_index = (new Date(date)).getUTCMonth();
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
 * @param {Date} date - This param is used to find the day of this date
 * @param {Array} data - The day will be found in this data_set
 * @return {Dictionary} The proper day object from data
 */
var getDayByDate = function(date, data){
    year_date = date.getUTCFullYear();
    month_index = date.getUTCMonth();
    day_index = date.getUTCDate()-1;
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

