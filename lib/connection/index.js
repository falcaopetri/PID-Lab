var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var ConnectionFactory = function() {
    this.SerialConnection = function(uri, config) {
        this.uri = uri;
        this.conn = new SerialPort(this.uri, {
            parser: serialport.parsers.readline("\n"),
            baudrate: config.baudrate || 9600
        }, false);
        this.config = config;
    }

    this.SerialConnection.prototype.connect = function() {
        console.log("connecting");
        var that = this;
        this.conn.open();
        this.conn.on("open", function() {
            console.log('open');
            this.on('data', that.config.data_received);
        });
    };

    this.SerialConnection.prototype.disconnect = function() {
        console.log("disconnecting");
        if (this.conn.isOpen()) {
            this.conn.close();
        }
    }
}

function list(callback) {
    serialport.list(function(err, ports) {
        if (err || ports.length == 0) {
            // TODO
        } else {
            connections = ports;
        }

        // TODO change callback
        // callback(connections);
        callback("update_connections_available", connections);
    });
}
ConnectionFactory.prototype.auto_detect = function(callback) {
    var connections = [];

    function list() {
        serialport.list(function(err, ports) {
            if (err || ports.length == 0) {
                // TODO
            } else {
                connections = ports;
            }

            // TODO change callback
            // callback(connections);
            callback("update_connections_available", connections);
        });
    };

    setTimeout(list, 1000);
}

module.exports = new ConnectionFactory();
