var config = require("@config").serial;
var logger = require("@config").logger;
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var SerialConnection = function(uri, conf) {
    this.config = conf || {};
    this.connName = uri;

    this.conn = new SerialPort(this.connName, {
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
        this.on('data', function (data) {
            try {
                var json = JSON.parse(data);
                // logger.debug("serial: received data", {data});
                that.config.data_received(json);
            }
            catch (e) {
                // TODO
            }
        });
    });
};

SerialConnection.prototype.disconnect = function() {
    console.log("disconnecting");
    if (this.conn.isOpen()) {
        this.conn.close();
        that.open_connections.splice(this, 1);
    }
};

SerialConnection.prototype.write = function (data) {
    logger.debug("SerialConnection#write", {data: data})
    var that = this;
    var message = JSON.stringify(data) + "#\n";
    console.log(message);
    this.conn.write(message, function () {
        that.conn.drain(function () {
            logger.debug("wrote");
        });
    });
};

SerialConnection.auto_detect = function (callback) {
    // TODO take off this async behavior
    serialport.list(function(err, ports) {
        if (err || ports.length == 0) {
            callback([]);
        } else {
            // Filter to ignore /dev/ttyS*
            ports = ports.filter(function (port) {
                return port.manufacturer !== undefined;
            });

            for (var i = 0; i < ports.length; i++) {
                ports[i].comType = "Serial";
            }
            
            callback(ports);
        }
    });
}


module.exports = SerialConnection;
