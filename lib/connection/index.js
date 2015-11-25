var SerialConnection = require("./serial_conn");
var BogusConnection = require("./bogus_conn");
var config = require("_/config");

var ConnectionFactory = function() {
    this.active_connections = [];
}

ConnectionFactory.prototype.connect = function(connName, callback) {
    if (config.bogus_conn.is_bogus_conn(connName)) {
        var bogus = new BogusConnection(connName, {
            data_received: callback
        });

        bogus.connect(callback);
        this.active_connections.push(bogus);
    }
    else {
        console.log("opening serial " + connName);
        var serial = new SerialConnection(connName, {
            data_received: callback
        });
        serial.connect();
        this.active_connections.push(serial);
    }
};

ConnectionFactory.prototype.auto_detect = function(callback) {
    var that = this;

    function list() {
        var connections = [];

        // TODO take off this async behavior
        SerialConnection.auto_detect(function (serials) {
            connections = serials;
            connections = connections.concat(BogusConnection.auto_detect());
            console.log("connections: " + JSON.stringify(connections));

            callback(connections);
        });

    };

    setTimeout(list, 1000);
}

module.exports = new ConnectionFactory();
