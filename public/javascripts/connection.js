var socket = io.connect("http://localhost:8000");
var request_pending = false;

socket.on("connect", function() {
    console.log("Connected!");

    socket.on('update_connections_available', updateConnectionsAvailable);
    socket.on('new_controller_data', newControllerData);
    request_connections_available();
});

function newControllerData(dat) {
    // push a new data point onto the back
    if (dat.message) {
        data.input.push(dat.message.input);
        data.output.push(dat.message.output);
        data.setpoint.push(dat.message.setpoint);

        // redraw the line, and then slide it to the left
        redraw(plots.input.path, line, newControllerData, dat);
        redraw(plots.input.area, area, newControllerData, dat);

        redraw(plots.setpoint.path, line, newControllerData, dat);

        redraw(plots.output.path, line, newControllerData, dat);
        redraw(plots.output.area, area, newControllerData, dat);

        // pop the old data point off the front
        for (var key in data) {
            data[key].shift();
        }
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
        table += "<td></td>";
        table += "/<tr>";
    } else {
        for (var i = 0; i < conns.length; i++) {
            var conn = conns[i];
            table += "<tr>";
            table += "<td>" + conn.comType + "</td>";
            table += "<td class=\"comName\">" + conn.comName + "</td>";
            table += "<td>" + (conn.pnpId ? conn.pnpId : "-") + "</td>";
            table += "<td>" + (conn.manufacturer ? conn.manufacturer : "-") + "</td>";
            table += "<td><button type=\"button\" class=\"btn btn-sm btn-success connect has-spinner\">Connect<i class=\"fa fa-spinner fa-spin\"/></button></td>";
            table += "</tr>";
        }
    }
    $('#conns_avail > tbody').append(table);
    $('button.connect').on('click', function() {
        // Source: http://stackoverflow.com/a/14460485
        $(this).toggleClass('active');
        $(this).blur();
        var connName = $(this).closest("tr").find("td.comName").text();
        connect(connName, this);
    });

    request_pending = false;
    loading_anim();
};

function connect(connName, connect_btn) {
    // TODO connect_btn
    console.log(connName);
    socket.emit("request_connection", {
        "connName": connName
    }, function(success) {
        if (success) {
            console.log("successful connection");
            request_overview_page();
            socket.emit('subscribe', connName);
        } else {
            // problem connecting
            console.error("connection failed");
        }
        $(connect_btn).toggleClass('active');
    });
}

function loading_anim() {
    if (request_pending) {
        $('#refresh').addClass('active');
        $('#conns_avail > tbody').addClass('disabled');
    }
    else {
        $('#refresh').removeClass('active');
        $('#refresh').blur();
        $('#conns_avail > tbody').removeClass('disabled');
    }
};

$('#refresh').on('click', function() {
    request_connections_available();
});

$('#analytics_btn').on('click', function() {
    $('#analytics').toggleClass("disabled");
    $('li.analytics').toggleClass("active");
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
