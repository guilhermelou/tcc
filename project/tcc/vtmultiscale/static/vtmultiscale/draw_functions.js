function drawCalendar(data){
    data_years = data['year_list'];
    rect.filter(function(d) {
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

    month_rect.filter(function(d) {
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

    year_rect.filter(function(d) {
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
    rect.on("mouseover", mouseOverDate);
    rect.on("mouseout", mouseOutDate);
    month_rect.on("mouseover", mouseOverDate);
    month_rect.on("mouseout", mouseOutDate);
    year_rect.on("mouseover", mouseOverDate);
    year_rect.on("mouseout", mouseOutDate);
    function mouseOverDate(d) {
        tooltip.style("visibility", "visible");
        date = d["date"];
        type = d["type"];
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
        tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
        tooltip.html(purchase_text)
                    .style("left", (d3.event.pageX)+30 + "px")
                    .style("top", (d3.event.pageY) + "px");
    }
    function mouseOutDate(d) {
        tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        var $tooltip = $("#tooltip");
        $tooltip.empty();
    }
}
        //var width = 960,
        //    height = 750,
        //    cellSize = 35; // cell size
        var width = 20,
            height = 800,
            cellSize = 3; // cell size
        var from_year = 1990,
            to_year = 1997 + 1;
        var range_year = to_year - from_year;
        var month_cell_size;
        var year_cell_width = cellSize*7;
        var year_cell_height = cellSize*3;
        var zoom = d3.behavior.zoom()
            .scaleExtent([-1, 10])
            .on("zoom", zoomed);

        // Not using this
        //var no_months_in_a_row = Math.floor(width / (cellSize * 7 + 50));
        // Using this instead
        var no_months_in_a_row = 1;

        var shift_up = cellSize * 3;

        var svg = d3.select("#chart0").append("svg")
//            .attr("width", 800)
//            .attr("height", 800)
            .append("g")
            .call(zoom);

        var g = svg.selectAll("g")
            .data(d3.range(from_year, to_year))
            .enter().append("g")
            //.attr("width", width)
            //.attr("height", height)
            .attr("class", "RdYlGn");


        var rect = g.selectAll(".day")
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
                        (range_year - (to_year - year(date)))*8*cellSize
                    );
                var month_padding = (
                        year_column + 1.2 * cellSize*7 *
                        ((month(date)-1) % (no_months_in_a_row))
                    );
                return day(date) * cellSize + month_padding;
            })
            .attr("y", function(d) {
                date = d['date'];
                var week_diff = (
                        week(date) - week(
                                new Date(year(date),month(date)-1, 1)
                        )
                );
                var row_level = Math.ceil(month(date) / (no_months_in_a_row));
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
        var month_rect = g.selectAll(".month")
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
            //.attr("width", cellSize)
            //.attr("height", cellSize)
            .attr("x", function(d) {
                date = d['date'];
                year_column = (range_year - (to_year - year(date)))*8*cellSize;
                var month_padding = (
                        year_column + 1.2 * cellSize*7 *
                        ((month(date)-1) % (no_months_in_a_row))
                );
                return month_padding;
            })
            .attr("y", function(d) {
                date = d['date'];
                var week_diff = (
                        week(date) -
                        week(new Date(year(date), month(date)-1, 1) )
                );
                var row_level = Math.ceil(month(date) / (no_months_in_a_row));
                return (
                        row_level*year_cell_height*1.5 +
                        shifting_days - cellSize/2 - shift_up
                );
            })
            .datum(function(d){
                return d;
            });

        shifting_months = shifting_days + year_cell_height*1.5*12 - year_cell_height*0.8 ;
        var year_rect = g.selectAll(".year")
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
                year_column = (range_year - (to_year - year(date)))*8*cellSize;
                var month_padding = (
                        year_column + 1.2 * cellSize*7 *
                        ((month(date)-1) % (no_months_in_a_row))
                );
                return month_padding;
            })
            .attr("y", function(d) {
                date = d['date'];
                var week_diff = (
                        week(date) -
                        week(new Date(year(date), month(date)-1, 1) )
                );
                var row_level = Math.ceil(month(date) / (no_months_in_a_row));
                return (
                        (week_diff*cellSize) + row_level*cellSize*7 +
                        shifting_months - cellSize/2 - shift_up
                );
            })
            .datum(function(d){
                return d;
            });
            /*
        var month_titles = svg.selectAll(".month-title")  // Jan, Feb, Mar and the whatnot
            .data(function(d) {
                return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
            .enter().append("text")
            .text(monthTitle)
            .attr("x", function(d, i) {
                var month_padding = 1.2 * cellSize*7* ((month(d)-1) % (no_months_in_a_row));
                return month_padding;
            })
            .attr("y", function(d, i) {
                var week_diff = week(d) - week(new Date(year(d), month(d)-1, 1) );
                var row_level = Math.ceil(month(d) / (no_months_in_a_row));
                return (week_diff*cellSize) + row_level*cellSize*8 - cellSize - shift_up;
            })
            .attr("class", "month-title")
            .attr("d", monthTitle);

        var year_titles = svg.selectAll(".year-title")  // Jan, Feb, Mar and the whatnot
            .data(function(d) { 
                return d3.time.years(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
            .enter().append("text")
            .text(yearTitle)
            .attr("x", function(d, i) { return width/2 - 100; })
            .attr("y", function(d, i) { return cellSize*5.5 - shift_up; })
            .attr("class", "year-title")
            .attr("d", yearTitle);

    */
        //  Tooltip Object
        var tooltip = d3.select("body")
        .append("div").attr("id", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");


        function dayTitle (t0) {
        return t0.toString().split(" ")[2];
        }
        function monthTitle (t0) {
        return t0.toLocaleString("en-us", { month: "long" });
        }
        function yearTitle (t0) {
        return t0.toString().split(" ")[3];
        }
        function zoomed() {
            svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale*1.2 + ")");
        }
