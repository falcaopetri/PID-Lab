var socket = io.connect("http://localhost:8000");

socket.on("connect", function () {
    console.log("Connected!");

    socket.on('update_connections_available', updateConnectionsAvailable);

    request_connections_available();
});

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

    loading_anim();
};

function connect(connName) {
    console.log(connName);
    socket.emit("request_connection", {"connName" : connName});
}

function loading_anim() {
    $('#refresh').toggleClass('active');
};

$('#refresh').on('click', function() {
    request_connections_available();
});

$('.overview').on('click', function () {
    console.log("requesting overview");
});

function request_connections_available() {
    loading_anim();
    socket.emit('request_connections_available');
}

$(document).ready(function() {

});
