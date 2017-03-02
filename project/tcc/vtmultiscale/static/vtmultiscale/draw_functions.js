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
                return format(date) + ": " + percent(day_obj["day_average"]);
            }
        });

        month_rect.filter(function(d) {
            month_obj = getMonthByDate(d, data_years);
            if (month_obj!=null){
                return month_obj["month"];
            }
        }).attr("class", function(d) {
            month_obj = getMonthByDate(d, data_years);
            if (month_obj!=null){
                return "month " + color_month(month_obj["average"]);
            }
        }).select("title")
        .text(function(d) { return d + ": " + percent(data[d]); });

        year_rect.filter(function(d) {
            year_obj = getYearByDate(d, data_years);
            if (year_obj!=null){
                return year_obj["year"];
            }
        }).attr("class", function(d) {
            year_obj = getYearByDate(d, data_years);
            if (year_obj!=null){
                return "year " + color_year(year_obj["average"]);
            }
        }).select("title").text(function(d) {
            return d + ": " + percent(year_average);
        });
        //  Tooltip
        rect.on("mouseover", mouseOverDate);
        rect.on("mouseout", mouseOutDate);
        function mouseOverDate(d) {
            tooltip.style("visibility", "visible");
            date = d["date"];
            type = d["type"];
            var amount_data = -1;
            switch(type){
                case "day":
                    day_obj = getDayByDate(date, data_years);
                    if (day_obj!=null){
                        amount_data = day_obj["day_average"];
                    }
                    break;
                case "month":
                    break;
                case "year":
                    break;
                default:
            }
            var purchase_text = format(date) + ": " + amount_data;
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

        var day = d3.time.format("%w"), // day of the week
            day_of_month = d3.time.format("%e"), // day of the month
            day_of_year = d3.time.format("%j"),
            week = d3.time.format("%U"), // week number of the year
            month = d3.time.format("%m"), // month number
            year = d3.time.format("%Y"),
            percent = d3.format(".1%"),
            format = d3.time.format("%Y-%m-%d");
        var color = d3.scale.quantize()
            .domain([0,300])
            .range(d3.range(11).map(function(d) {  return "q" + d + "-11"; }));
        var color_month = d3.scale.quantize()
            .domain([0,300])
            .range(d3.range(11).map(function(d) {  return "q" + d + "-11"; }));
        var color_year = d3.scale.quantize()
            .domain([0,50])
            .range(d3.range(11).map(function(d) {  return "q" + d + "-11"; }));
    /*
        var svg = d3.select("#chart").selectAll("svg")
            .data(d3.range(from_year, to_year))
            .enter().append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "RdYlGn")
            .append("g")
            .call(zoom);
    */
        /*
        var svg = d3.select("#chart").append("svg")
        .attr("width", 800)
        .attr("height", 800)
        .call(zoom);
    */
        var svg = d3.select("#chart").append("svg")
            .attr("width", 800)
            .attr("height", 800)
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
                year_column = (range_year - (to_year - year(date)))*8*cellSize;
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
            return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1));
            })
        .enter().append("rect")
            .attr("class", "month")
            .attr("width", year_cell_width)
            .attr("height", year_cell_height)
            //.attr("width", cellSize)
            //.attr("height", cellSize)
            .attr("x", function(d) {
                year_column = (range_year - (to_year - year(d)))*8*cellSize;
                var month_padding = year_column + 1.2 * cellSize*7 * ((month(d)-1) % (no_months_in_a_row));
                return month_padding;
                /*
                year_column = (range_year - (to_year - year(d)))*8*cellSize;
                var month_padding = year_column + 1.2 * cellSize*7 * ((month(d)-1) % (no_months_in_a_row));
                return day(d) * cellSize + month_padding;
                */
            })
            .attr("y", function(d) {
                /*
            var week_diff = week(d) - week(new Date(year(d), month(d)-1, 1) );
            var row_level = Math.ceil(month(d) / (no_months_in_a_row));
            return (week_diff*cellSize) + row_level*cellSize*7 + shifting_days - cellSize/2 - shift_up;
            */
            var week_diff = week(d) - week(new Date(year(d), month(d)-1, 1) );
            var row_level = Math.ceil(month(d) / (no_months_in_a_row));
            return row_level*year_cell_height*1.5 + shifting_days - cellSize/2 - shift_up;
            })
            .datum(format);

        shifting_months = shifting_days + year_cell_height*1.5*12 - year_cell_height*0.8 ;
        var year_rect = g.selectAll(".year")
            .data(function(d) {
            return d3.time.years(new Date(d, 0, 1), new Date(d + 1, 0, 1));
            })
        .enter().append("rect")
            .attr("class", "year")
            .attr("width", year_cell_width)
            .attr("height", year_cell_height)
            .attr("x", function(d) {
                year_column = (range_year - (to_year - year(d)))*8*cellSize;
                var month_padding = year_column + 1.2 * cellSize*7 * ((month(d)-1) % (no_months_in_a_row));
                return month_padding;
            })
            .attr("y", function(d) {
            var week_diff = week(d) - week(new Date(year(d), month(d)-1, 1) );
            var row_level = Math.ceil(month(d) / (no_months_in_a_row));
            return (week_diff*cellSize) + row_level*cellSize*7 + shifting_months - cellSize/2 - shift_up;
            })
            .datum(format);
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
