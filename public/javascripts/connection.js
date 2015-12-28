var socket = io.connect("http://localhost:8000");
var request_pending = false;
var connection;

socket.on("connect", function() {
    console.log("Connected!");

    socket.on('update_connections_available', updateConnectionsAvailable);
    socket.on('new_controller_data', newControllerData);
    request_connections_available();
});

function newControllerData(dat) {
    // push a new data point onto the back
    if (dat.message) {
        // TODO rename function
        updateData(dat);
    }
}

function send_new_controller_parameters() {
    socket.emit('new_controller_parameters', current_controller);
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
    connection = {
            connName: connName
    };
    
    // TODO connect_btn

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

// TODO NOT IMPLEMENTED
// $('#analytics_btn').on('click', function() {
//     $('#analytics').toggleClass("disabled");
//     $('li.analytics').toggleClass("active");
// });

function request_overview_page() {
    $('#connection_info #connection_name td').text(connection.connName);

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
