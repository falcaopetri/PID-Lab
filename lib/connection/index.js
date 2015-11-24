var serial_conn = require("./serial_conn");
var BogusConnection = require("./bogus_conn");
var config = require("_/config");

var ConnectionFactory = function() {
    this.open_connections = [];

    this.SerialConnection = serial_conn;
}

ConnectionFactory.prototype.connect = function(connName, callback) {
    if (config.bogus_conn.is_bogus_conn(connName)) {
        var bogus = new BogusConnection(connName, {
            data_received: callback
        });

        bogus.connect(callback);
        this.open_connections.push(bogus);
    }
    else {
        // TODO
        // this.open_connections.push(this.SerialConnection.connect(callback));
    }
};

ConnectionFactory.prototype.auto_detect = function(callback) {
    var that = this;

    function list() {
        var connections = [];

        // TODO take off this async behavior
        that.SerialConnection.auto_detect(function (serials) {
            connections = serials;
            connections = connections.concat(BogusConnection.auto_detect());
            console.log("connections: " + JSON.stringify(connections));
            
            callback(connections);
        });

    };

    setTimeout(list, 1000);
}

module.exports = new ConnectionFactory();
