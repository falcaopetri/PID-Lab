var config = require("_/config").bogus_conn;
var logger = require("_/config").logger;

var BogusConnection = function(uri, conf) {
    logger.debug("creating bogus connection", {"configuration": conf});
    this.config = conf;
}

BogusConnection.prototype.connect = function() {
    var that = this;
    setInterval(function () {
        var data = {
            input: Math.floor((Math.random() * 100) + 1)/100.0,
            output: Math.floor((Math.random() * 100) + 1)/100.0,
            setpoint: 0.5
        };
        that.config.data_received(data);
    }, 100);
};

BogusConnection.prototype.disconnect = function() {
    console.log("disconnecting");
};

BogusConnection.auto_detect = function (callback) {
    return [config.default_values];
}

module.exports = BogusConnection;
