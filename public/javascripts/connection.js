var socket = io.connect("http://localhost:8000");
var request_pending = false;
var svg, path;
socket.on("connect", function () {
    console.log("Connected!");

    socket.on('update_connections_available', updateConnectionsAvailable);
    socket.on('new_controller_data', newControllerData);
    request_connections_available();
});

var data = new Array(35).fill(0);;
var margin = {top: 20, right: 20, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var n = 40;
var x = d3.scale.linear()
    .domain([0, n - 1])
    .range([0, width]);
var y = d3.scale.linear()
    .domain([-1, 1])
    .range([height, 0]);

var line = d3.svg.line()
    .x(function(d, i) { return x(i); })
    .y(function(d, i) { return y(d); });

function newControllerData(dat) {

    // push a new data point onto the back
    console.log(dat.message);
    if (dat.message.input) {
        data.push(dat.message.input);
        console.log("data:");
        console.log(data);
        // redraw the line, and then slide it to the left
        path
              .attr("d", line)
              .attr("transform", null)
            .transition()
              .duration(500)
              .ease("linear")
              .attr("transform", "translate(" + x(-1) + ",0)")
              .each("end", newControllerData, dat);
        // pop the old data point off the front
        // if (data.length > 100) {
            data.shift();
        // }
    }
}

function updateConnectionsAvailable(conns) {
    // Source: http://stackoverflow.com/a/17359208
    console.log("updating connections to " + JSON.stringify(conns));
    $('#conns_avail > tbody').empty();
    var table = "";
    if (conns.length == 0) {
        table += "<tr>";
        table += "<td>No connections available</td>";
        table += "<td></td>";
        table += "<td></td>";
        table += "<td></td>";
        table += "/<tr>";
    }
    else {
        for (var i = 0; i < conns.length; i++) {
            var conn = conns[i];
            table += "<tr>";
            table += "<td class=\"comName\">" + conn.comName + "</td>";
            table += "<td>" + conn.pnpId + "</td>";
            table += "<td>" + conn.manufacturer + "</td>";
            table += "<td><button type=\"button\" class=\"btn btn-sm btn-success connect\">Connect</button></td>";
            table += "</tr>";
        }
    }
    $('#conns_avail > tbody').append(table);
    $('.connect').on('click', function() {
        // Source: http://stackoverflow.com/a/14460485
        var connName = $(this).closest("tr").find("td.comName").text();
        connect(connName);
    });

    request_pending = false;
    loading_anim();
};

function connect(connName) {
    console.log(connName);
    socket.emit("request_connection", {"connName" : connName}, function (success) {
        if (success) {
            console.log("successful connection");
            request_overview_page();
            socket.emit('subscribe', connName);
        }
        else {
            // problem connecting
            console.error("connection failed");
        }
    });
}

function loading_anim() {
    $('#refresh').toggleClass('active');
};

$('#refresh').on('click', function() {
    request_connections_available();
});

$('#analytics_btn').on('click', function() {
    $('#analytics').toggleClass("disabled");
});

function request_overview_page() {
    $('#conns').toggleClass("disabled");
    $('#overview').toggleClass("disabled");

    $('li.connect').toggleClass("active");
    $('a.connect').toggleClass("disabled");

    $('.overview').toggleClass("active");

    $('.connected').toggleClass("disabled");
}

function request_connections_available() {
    if (!request_pending) {
        request_pending = true;
        loading_anim();
        socket.emit('request_connections_available');
    }
}
$(document).ready(function() {
    svg = d3.select(".plot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + y(0) + ")")
        .call(d3.svg.axis().scale(x).orient("bottom"));
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(y).orient("left"));
    path = svg.append("g")
        .attr("clip-path", "url(#clip)")
      .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
});
