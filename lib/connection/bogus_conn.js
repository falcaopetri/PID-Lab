var config = require("_/config").bogus_conn;

var BogusConnection = function(uri, conf) {
    console.log("creating bogus connection");
    this.config = conf;
}

BogusConnection.prototype.connect = function() {
    console.log("connecting");
    var that = this;
    setInterval(function () {
        // var data = {input: Math.floor((Math.random() * 10) + 1)};
        var data = {input: Math.floor((Math.random() * 100) + 1)/100.0};
        console.log("bogus " + data);
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
