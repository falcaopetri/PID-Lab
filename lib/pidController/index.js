var connection = require("@connection");
var logger = require("@config").logger;

var PIDController = {
    auto_detect: function(callback) {
        connection.auto_detect(callback);
    },

    connect: function(connName, data_received, callback) {
        this.auto_detect(function(what, connsAvailable) {
            // TODO validar se connName percente à connsAvailable
            // if (connsAvailable.indexOf(connName) == -1) {
            //     // error
            //     callback("failed to connect");
            // }
            // else {
            //     console.log(connsAvailable);
            //     callback(null);
            // }
            var serial = connection.connect(connName, data_received);
            // data_received: function(data) {
            //     try {
            //         JSON.parse(data.toString());
            //         console.log("d: " + data);
            //     }
            //     catch(err) {
            //         console.log(err);
            //     }
            // }
            callback(null);
        });
    },

    send: function(connName, data_to_send, callback) {
        // TODO
        var filtered = connection.active_connections.filter(function(element) {
            return element.connName.localeCompare(connName) == 0;
        })[0];

        // logger.debug("filtered:", {filtered});
        filtered.write(data_to_send);
    }
};
module.exports = PIDController;
