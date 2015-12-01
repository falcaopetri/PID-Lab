// TODO Should check for js files splitting - Grunt, request.js?
var svgs = {};
var plots = {};

var data = {
    // TODO is this use of Array correct?
    input: new Array(40).fill(0),
    output: new Array(40).fill(0),
    setpoint: new Array(40).fill(0)
};

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
    .domain([-1, 1])
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
    .y0(height/2)
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

$(document).ready(function() {
    // TODO generator function to svgs and paths
    // CTRL+C - CTRL+V code:
    svgs.input = d3.select(".plot #input").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svgs.input.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);
    svgs.input.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + y(0) + ")")
        .call(d3.svg.axis().scale(x).orient("bottom"));
    svgs.input.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(y).orient("left"));

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

    svgs.output = d3.select(".plot #output").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svgs.output.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);
    svgs.output.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + y(0) + ")")
        .call(d3.svg.axis().scale(x).orient("bottom"));
    svgs.output.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(y).orient("left"));

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
});
