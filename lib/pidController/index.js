var connection = require("_/connection");


var PIDController = {
    auto_detect: function (callback) {
        connection.auto_detect(callback);
    },

    connect: function (connName, data_received, callback) {
        this.auto_detect(function (what, connsAvailable) {
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
    }
};

module.exports = PIDController;
