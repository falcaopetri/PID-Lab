var config = require("@config").bogus_conn;
var logger = require("@config").logger;

var BogusConnection = function(uri, conf) {
    logger.debug("creating bogus connection", {"configuration": conf});
    this.config = conf;
}

var random = function(max, precision) {
    var pow = Math.pow(10, precision);
    return Math.floor(Math.random() * (max + 1) * pow) / pow;
}

BogusConnection.prototype.connect = function() {
    var that = this;
    var local_random = function () {
        return random(200, 2);
    }
    var pid = [local_random(), local_random(), local_random()];
    setInterval(function () {
        var data = {
            input: local_random(),
            output: local_random(),
            setpoint: 40,
            pid: pid
        };
        that.config.data_received(data);
    }, 200);
};

BogusConnection.prototype.disconnect = function() {
    console.log("disconnecting");
};

BogusConnection.auto_detect = function (callback) {
    return [config.default_values];
}

module.exports = BogusConnection;
