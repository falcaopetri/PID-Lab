var connection = require("@connection");
var logger = require("@config").logger;

// TODO is this class really necessary? isn't @connection enough?
var PIDController = {
    auto_detect: function(callback) {
        connection.auto_detect(callback);
    },

    connect: function(client_id, connName, data_received, callback) {
        // TODO validar se connName percente à connsAvailable
        // if (connsAvailable.indexOf(connName) == -1) {
        //     // error
        //     callback("failed to connect");
        // }
        // else {
        //     console.log(connsAvailable);
        //     callback(null);
        // }
        var serial = connection.connect(client_id, connName, data_received, callback);
        // data_received: function(data) {
        //     try {
        //         JSON.parse(data.toString());
        //         console.log("d: " + data);
        //     }
        //     catch(err) {
        //         console.log(err);
        //     }
        // }
    },

    // TODO if a client is connected only to one connName at a time, we should not pass the connName
    disconnect: function(client_id, connName, callback) {
        connection.disconnect(client_id, connName, callback);
    },

    getInfo: function(connName) {
        // TODO should treat this case more carefully
        if (connection.active_connections[connName]) {
            return connection.active_connections[connName].getInfo();
        } else {
            return {};
        }
    },

    send: function(connName, data_to_send, callback) {
        // TODO
        // validate if connName is active
        var filtered = connection.active_connections[connName];

        logger.debug("filtered:", filtered);
        filtered.conn.write(data_to_send);
    }
};
module.exports = PIDController;
