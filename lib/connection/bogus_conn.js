var config = require("@config").bogus_conn;
var logger = require("@config").logger;

var BogusConnection = function(uri, conf) {
    logger.debug("creating bogus connection", {"configuration": conf});
    this.config = conf;
    this.connName = uri;
    // TODO move to config.js

    // var pid = [local_random(), local_random(), local_random()];
    var pid = [100, 150, 50];
    this.config.default_pid =  {
        input: local_random(),
        output: local_random(),
        setpoint: 40,
        pid: pid
    };
}

var local_random = function () {
    return random(200, 2);
}

var random = function(max, precision) {
    var pow = Math.pow(10, precision);
    return Math.floor(Math.random() * (max + 1) * pow) / pow;
}

BogusConnection.prototype.connect = function() {
    var that = this;
    // TODO
    this.curr_data = this.config.default_pid;

    setInterval(function () {
        that.curr_data.input = local_random();
        that.curr_data.output = local_random();

        that.config.data_received(that.curr_data);
    }, 200);
};

BogusConnection.prototype.disconnect = function() {
    console.log("disconnecting");
};

BogusConnection.prototype.write = function(data) {
    // TODO
    logger.debug("BogusConnection#write", {data: data})
    this.curr_data.pid = data.pid;
};

BogusConnection.auto_detect = function () {
    return [config.default_values];
};

module.exports = BogusConnection;
