// TODO Should check for js files splitting - Grunt, request.js?
var svgs = {};
var plots = {};

var data = {
    // TODO is this use of Array correct?
    input: new Array(40).fill(0),
    output: new Array(40).fill(0),
    setpoint: new Array(40).fill(0),
    // TODO bad idea:
    pid: [new Array(40).fill(0), new Array(40).fill(0), new Array(40).fill(0)],

    get_curr_values: function () {
        return {
            input: data.input[n-1],
            output: data.output[n-1],
            setpoint: data.setpoint[n-1],
            pid: [data.pid[0][n-1], data.pid[1][n-1], data.pid[2][n-1]]
        }
    }
};

var current_controller = null;

var margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 40
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

width *= 0.5;
height *= 0.5;

var n = 40;
var x = d3.scale.linear()
    .domain([0, n - 1])
    .range([0, width]);
var y = d3.scale.linear()
    .domain([0, 270])
    .range([height, 0]);

var line = d3.svg.line()
    .x(function(d, i) {
        return x(i);
    })
    .y(function(d, i) {
        return y(d);
    })
    .interpolate("basis");

var area = d3.svg.area()
    .x(function(d, i) {
        return x(i);
    })
    .y0(height)
    .y1(function(d, i) {
        return y(d);
    })
    .interpolate("basis");

// TODO rename parameters properly
function redraw(path, func, method, data) {
    path
        .attr("d", func)
        .attr("transform", null)
        .transition()
        .duration(500)
        .ease("linear")
        .attr("transform", "translate(" + x(-1) + ",0)")
        .each("end", method, data);
}

function new_svg(selector) {
    svg = d3.select(selector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);
    return svg;
}

function set_axes(svg) {
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + y(0) + ")")
        .call(d3.svg.axis().scale(x).orient("bottom"));
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(y).orient("left"));
}

function calculate_new_value(pos, incr) {
    if (current_controller === null ) {
        current_controller = data.get_curr_values();
    }

    current_controller.pid[pos] += incr;
}

$("body").keydown(function(e) {
    // Source: https://css-tricks.com/row-and-column-highlighting/
    switch (e.which) {
        case 13: // Enter
            e.preventDefault();
            // TODO
            send_new_controller_parameters();
            break;
        case 85: // P UP
            $("#pid_table .up td:nth-of-type(1)").toggleClass("hover");
            calculate_new_value(0, 1);
            $("#pid_table #pid_new_values td:nth-of-type(1)").text(current_controller.pid[0]);
            break;
        case 73: // I UP
            $("#pid_table .up td:nth-of-type(2)").toggleClass("hover");
            calculate_new_value(1, 1);
            $("#pid_table #pid_new_values td:nth-of-type(2)").text(current_controller.pid[1]);
            break;
        case 79: // D UP
            $("#pid_table .up td:nth-of-type(3)").toggleClass("hover");
            calculate_new_value(2, 1);
            $("#pid_table #pid_new_values td:nth-of-type(3)").text(current_controller.pid[2]);
            break;
        case 74: // P DOWN
            $("#pid_table .down td:nth-of-type(1)").toggleClass("hover");
            calculate_new_value(0, -1);
            $("#pid_table #pid_new_values td:nth-of-type(1)").text(current_controller.pid[0]);
            break;
        case 75: // I DOWN
            $("#pid_table .down td:nth-of-type(2)").toggleClass("hover");
            calculate_new_value(1, -1);
            $("#pid_table #pid_new_values td:nth-of-type(2)").text(current_controller.pid[1]);
            break;
        case 76: // D DOWN
            $("#pid_table .down td:nth-of-type(3)").toggleClass("hover");
            calculate_new_value(2, -1);
            $("#pid_table #pid_new_values td:nth-of-type(3)").text(current_controller.pid[2]);
            break;
    }
});

$("body").keyup(function(e) {
    // Source: https://css-tricks.com/row-and-column-highlighting/
    $("#pid_table td").removeClass("hover");
});

function updateUI(dat) {
    $("#pid_curr_values label.p").text(data.pid[0][n - 1]);
    $("#pid_curr_values label.i").text(data.pid[1][n - 1]);
    $("#pid_curr_values label.d").text(data.pid[2][n - 1]);

    // redraw the line, and then slide it to the left
    redraw(plots.input.path, line, newControllerData, dat);
    redraw(plots.input.area, area, newControllerData, dat);

    redraw(plots.setpoint.path, line, newControllerData, dat);

    redraw(plots.pid.p, line, newControllerData, dat);
    redraw(plots.pid.i, line, newControllerData, dat);
    redraw(plots.pid.d, line, newControllerData, dat);

    redraw(plots.output.path, line, newControllerData, dat);
    redraw(plots.output.area, area, newControllerData, dat);
}

function updateData(dat) {
    data.input.push(dat.message.input);
    data.output.push(dat.message.output);
    data.setpoint.push(dat.message.setpoint);

    // TODO CTRL+C - CTRL+V is bad anywhere
    data.pid[0].push(dat.message.pid[0]);
    data.pid[1].push(dat.message.pid[1]);
    data.pid[2].push(dat.message.pid[2]);

    updateUI(dat);

    // pop the old data point off the front
    // for (var key in data) {
    //     data[key].shift();
    // }
    data["input"].shift();
    data["output"].shift();
    data["setpoint"].shift();

    data["pid"][0].shift();
    data["pid"][1].shift();
    data["pid"][2].shift();
}
$(document).ready(function() {
    // TODO generator function to svgs and paths
    // -improved with new_svg()-
    // CTRL+C - CTRL+V code:
    svgs.input = new_svg(".plot #input");

    plots.input = {};
    plots.input.top = svgs.input.append("g")
        .attr("clip-path", "url(#clip)");

    plots.input.area = plots.input.top.append("path")
        .datum(data.input)
        .attr("class", "area")
        .attr("d", area);

    plots.input.path = plots.input.top.append("path")
        .datum(data.input)
        .attr("class", "line")
        .attr("d", line)
        .attr('stroke', 'black');

    plots.setpoint = {};
    plots.setpoint.top = plots.input.top;

    plots.setpoint.path = plots.setpoint.top.append("path")
        .datum(data.setpoint)
        .attr("class", "line")
        .attr("d", line)
        .attr('stroke', 'red');
    set_axes(svgs.input);

    svgs.output = new_svg(".plot #output")

    plots.output = {};
    plots.output.top = svgs.output.append("g")
        .attr("clip-path", "url(#clip)");

    plots.output.area = plots.output.top.append("path")
        .datum(data.output)
        .attr("class", "area")
        .attr("d", area);

    plots.output.path = plots.output.top.append("path")
        .datum(data.output)
        .attr("class", "line")
        .attr("d", line)
        .attr('stroke', 'black');
    set_axes(svgs.output);

    svgs.pid = new_svg(".plot #pid_parameters");

    plots.pid = {};
    plots.pid.top = svgs.pid.append("g")
        .attr("clip-path", "url(#clip)");

    plots.pid.p = plots.pid.top.append("path")
        .datum(data.pid[0])
        .attr("class", "line")
        .attr("d", line)
        .attr('stroke', 'red');

    plots.pid.i = plots.pid.top.append("path")
        .datum(data.pid[1])
        .attr("class", "line")
        .attr("d", line)
        .attr('stroke', 'blue');

    plots.pid.d = plots.pid.top.append("path")
        .datum(data.pid[2])
        .attr("class", "line")
        .attr("d", line)
        .attr('stroke', 'green');
    set_axes(svgs.pid);
});
