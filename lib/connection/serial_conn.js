var config = require("_/config").serial;
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var SerialConnection = function(uri, conf) {
    this.config = conf || {};
    this.uri = uri;

    this.conn = new SerialPort(this.uri, {
        parser: serialport.parsers.readline("\n"),
        baudrate: this.config.baudrate || config.baudrate
    }, false);
}

SerialConnection.prototype.connect = function() {
    console.log("connecting");
    var that = this;
    this.conn.open();
    this.conn.on("open", function() {
        console.log('open');
        // that.open_connections.append(this);
        this.on('data', that.config.data_received);
    });
};

SerialConnection.prototype.disconnect = function() {
    console.log("disconnecting");
    if (this.conn.isOpen()) {
        this.conn.close();
        that.open_connections.splice(this, 1);
    }
};


SerialConnection.auto_detect = function (callback) {
    // TODO take off this async behavior
    serialport.list(function(err, ports) {
        if (err || ports.length == 0) {
            callback([]);
        } else {
            callback(ports);
        }
    });
}


module.exports = SerialConnection;
