var VtMultiScale = function(chart, year_range, data){
        this.data = data;
        var othis = this;
        var width = 20,
            height = 450,
            cellSize = 3; // cell size
        var from_year = year_range[0],
            to_year = year_range[1] + 1;
        var range_year = to_year - from_year;
        var month_cell_size;
        var year_cell_width = cellSize*7;
        var year_cell_height = cellSize*3;
        var zoom = d3.behavior.zoom()
            .scaleExtent([0.001, 10])
            .on("zoom", function(){
                    othis.zoomed.apply(othis, arguments);
            });

        var no_months_in_a_row = 1;

        var shift_up = cellSize * 3;

        this.svg = d3.select(chart).append("svg")
            .attr("height", height)
            .attr("class", "col-lg-6");
        this.g = this.svg.append("g")
            .call(zoom);
        this.g_years = this.g.selectAll("g")
            .data(d3.range(from_year, to_year))
            .enter().append("g")
            //.attr("width", width)
            //.attr("height", height)
            .attr("class", "RdYlGn");

        this.rect = this.g_years.selectAll(".day")
            .data(function(d) {
                array_date = d3.time.days(
                        new Date(d, 0, 1), new Date(d + 1, 0, 1)
                );
                array_dict = [];
                for(i in array_date){
                    array_dict.push({'type':'day', 'date':array_date[i]});
                }
                return array_dict;
            })
        .enter().append("rect")
            .attr("class", "day")
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("x", function(d) {
                date = d['date'];
                year_column = (
                        (range_year - (to_year - format_year(date)))*8*cellSize
                    );
                var month_padding = (
                        year_column + 1.2 * cellSize*7 *
                        ((only_month(date)-1) % (no_months_in_a_row))
                    );
                return day(date) * cellSize + month_padding;
            })
            .attr("y", function(d) {
                date = d['date'];
                var week_diff = (
                        week(date) - week(
                                new Date(format_year(date),only_month(date)-1, 1)
                        )
                );
                var row_level = Math.ceil(only_month(date) / (no_months_in_a_row));
                return (
                        (week_diff*cellSize) +
                        row_level*cellSize*7 -
                        cellSize/2 -
                        shift_up
                );
            })
            .datum(function(d){
                return d;
            });

        // shifiting days slots
        shifting_days = 12*(cellSize*7.2);
        this.month_rect = this.g_years.selectAll(".month")
            .data(function(d) {
                array_date = d3.time.months(
                    new Date(d, 0, 1), new Date(d + 1, 0, 1)
                );
                array_dict = [];
                for(i in array_date){
                    array_dict.push({'type':'month', 'date':array_date[i]});
                }
                return array_dict;
        })
        .enter().append("rect")
            .attr("class", "month")
            .attr("width", year_cell_width)
            .attr("height", year_cell_height)
            .attr("x", function(d) {
                date = d['date'];
                year_column = (range_year - (to_year - format_year(date)))*8*cellSize;
                var month_padding = (
                        year_column + 1.2 * cellSize*7 *
                        ((only_month(date)-1) % (no_months_in_a_row))
                );
                return month_padding;
            })
            .attr("y", function(d) {
                date = d['date'];
                var week_diff = (
                        week(date) -
                        week(new Date(format_year(date), only_month(date)-1, 1) )
                );
                var row_level = Math.ceil(only_month(date) / (no_months_in_a_row));
                return (
                        row_level*year_cell_height*1.5 +
                        shifting_days - cellSize/2 - shift_up
                );
            })
            .datum(function(d){
                return d;
            });

        shifting_months = (
                shifting_days +
                year_cell_height*1.5*12 -
                year_cell_height*0.8
            );
        this.year_rect = this.g_years.selectAll(".year")
            .data(function(d) {
                array_date = d3.time.years(
                        new Date(d, 0, 1), new Date(d + 1, 0, 1)
                );
                array_dict = [];
                for(i in array_date){
                    array_dict.push({'type':'year', 'date':array_date[i]});
                }
                return array_dict;
            })
        .enter().append("rect")
            .attr("class", "year")
            .attr("width", year_cell_width)
            .attr("height", year_cell_height)
            .attr("x", function(d) {
                date = d['date'];
                year_column = (range_year - (to_year - format_year(date)))*8*cellSize;
                var month_padding = (
                        year_column + 1.2 * cellSize*7 *
                        ((only_month(date)-1) % (no_months_in_a_row))
                );
                return month_padding;
            })
            .attr("y", function(d) {
                date = d['date'];
                var week_diff = (
                        week(date) -
                        week(new Date(format_year(date), only_month(date)-1, 1) )
                );
                var row_level = Math.ceil(only_month(date) / (no_months_in_a_row));
                return (
                        (week_diff*cellSize) + row_level*cellSize*7 +
                        shifting_months - cellSize/2 - shift_up
                );
            })
            .datum(function(d){
                return d;
            });
        //  Tooltip Object
        this.tooltip = d3.select("body")
        .append("div").attr("id", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");
    this.drawCalendarData();
};

VtMultiScale.prototype.drawCalendarData = function () {
    var othis = this;
    data_years = this.data['year_list'];
    console.log(this.data);
    this.rect.filter(function(d) {
        date = d['date'];
        day_obj = getDayByDate(date, data_years);
        if (day_obj!=null){
            return day_obj["day"];
        }
    }).attr("class", function(d) {
        date = d['date'];
        day_obj = getDayByDate(date, data_years);
        if (day_obj!=null){
            return "day " + color(day_obj["day_average"]);
        }
    }).select("title")
    .text(function(d) {
        date = d['date'];
        day_obj = getDayByDate(date, data_years);
        if (day_obj!=null){
            return format(date) + ": " + day_obj["day_average"];
        }
    });

    this.month_rect.filter(function(d) {
        date = d['date'];
        month_obj = getMonthByDate(date, data_years);
        if (month_obj!=null){
            return month_obj["month"];
        }
    }).attr("class", function(d) {
        date = d['date'];
        month_obj = getMonthByDate(date, data_years);
        if (month_obj!=null){
            return "month " + color_month(month_obj["average"]);
        }
    }).select("title")
    .text(function(d) {
        date = d['date'];
        month_obj = getMonthByDate(date, data_years);
        if (month_obj!=null){
            return format_month(date) + ": " + month_obj["average"];
        }
    });

    this.year_rect.filter(function(d) {
        date = d['date'];
        year_obj = getYearByDate(date, data_years);
        if (year_obj!=null){
            return year_obj["year"];
        }
    }).attr("class", function(d) {
        date = d['date'];
        year_obj = getYearByDate(date, data_years);
        if (year_obj!=null){
            return "year " + color_year(year_obj["average"]);
        }
    }).select("title").text(function(d) {
        date = d['date'];
        year_obj = getYearByDate(date, data_years);
        if (year_obj!=null){
            return format_year(date) + ": " + year_obj["average"];
        }
    });
    //  Tooltip
    this.rect.on("mouseover", function(data, index, base){
            return othis.mouseOverDate.apply(othis, [data, index, base, this]);
    });
    this.year_rect.on("mouseover", function(data, index, base){
            return othis.mouseOverDate.apply(othis, [data, index, base, this]);
    });
    this.month_rect.on("mouseover", function(data, index, base){
            return othis.mouseOverDate.apply(othis, [data, index, base, this]);
    });
    this.rect.on("mouseout", function(data, index, base){
            return othis.mouseOutDate.apply(othis, [data, index, base, this]);
    });
    this.month_rect.on("mouseout", function(data, index, base){
            return othis.mouseOutDate.apply(othis, [data, index, base, this]);
    });
    this.year_rect.on("mouseout", function(data, index, base){
            return othis.mouseOutDate.apply(othis, [data, index, base, this]);
    });
}

VtMultiScale.prototype.mouseOverDate = function(data, index, base, obj){
    this.tooltip.style("visibility", "visible");
    date = data["date"];
    type = data["type"];
    var amount_data = -1;
    var date_formated = -1;
    switch(type){
        case "day":
            day_obj = getDayByDate(date, data_years);
            if (day_obj!=null){
                amount_data = day_obj["day_average"];
                date_formated = format(date);
            }
            break;
        case "month":
            month_obj = getMonthByDate(date, data_years);
            if (month_obj!=null){
                amount_data = month_obj["average"];
                date_formated = format_month(date);
            }
            break;
        case "year":
            year_obj = getYearByDate(date, data_years);
            if (year_obj!=null){
                amount_data = year_obj["average"];
                date_formated = format_year(date);
            }
            break;
        default:
    }
    var purchase_text = "<p>"+date_formated + ":</p> " + amount_data;
    this.tooltip.transition()
                .duration(200)
                .style("opacity", .9);
    this.tooltip.html(purchase_text)
                .style("left", (d3.event.pageX)+30 + "px")
                .style("top", (d3.event.pageY) + "px");
};

VtMultiScale.prototype.mouseOutDate = function(data, index, base, obj){
    this.tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    /*
    var $tooltip = $("#tooltip");
    $tooltip.empty();
    */
};

VtMultiScale.prototype.zoomed = function(){
    this.g.attr(
            "transform",
            "translate(" +
            d3.event.translate +
            ")scale(" +
            d3.event.scale*1.2 +
            ")"
    );
};
/*
        function dayTitle (t0) {
        return t0.toString().split(" ")[2];
        }
        function monthTitle (t0) {
        return t0.toLocaleString("en-us", { month: "long" });
        }
        function yearTitle (t0) {
        return t0.toString().split(" ")[3];
        }
*/

