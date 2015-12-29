var SerialConnection = require("./serial_conn");
var BogusConnection = require("./bogus_conn");
var config = require("@config");
var logger = config.logger;

var ConnectionFactory = {
    active_connections: {}
};

ConnectionFactory.connect = function(client_id, connName, data_callback, callback) {
    // TODO add success/error callback
    // generalize conn creation

    var err = null;

    if (connName in this.active_connections) {
        // someone is already connected to this connection
        // we will add the data_callback as the callback to client_id
        this.active_connections[connName].clients[client_id] = {
            callback: data_callback
        };
        logger.debug("connName already connected. counter: " + Object.keys(this.active_connections[connName].clients).length);
        // no errors reported
    } else {
        // should create the desired connection
        if (config.bogus_conn.is_bogus_conn(connName)) {
            logger.info("Creating new BogusConnection");
            var bogus = new BogusConnection(connName, {
                data_received: data_callback
            });

            bogus.connect(function() {
                for (var client in this.active_connections[connName].clients) {
                    client.callback();
                }
            });
            logger.debug("adding", bogus);
            var that = this;
            this.active_connections[connName] = {
                conn: bogus,
                clients: {},
                getInfo: function () {
                    return {
                        connName: connName,
                        counter: Object.keys(that.active_connections[connName].clients).length
                    };
                }
            };
            this.active_connections[connName].clients[client_id] = {
                callback: data_callback
            };
            // no errors reported
        } else {
            logger.info("Creating new SerialConnection", {
                connName: connName
            });
            var serial = new SerialConnection(connName, {
                data_received: function() {
                    for (var client in this.active_connections[connName].clients) {
                        client.callback();
                    }
                }
            });
            serial.connect();
            this.active_connections[connName] = {
                conn: serial,
                clients: {}
            };
            this.active_connections[connName].clients[client_id] = {
                callback: data_callback
            };
            // no errors reported
        }
    }

    // Hopefully, err will be NULL
    callback(err);
};

ConnectionFactory.disconnect = function(client_id, connName, callback) {
    if (!this.active_connections[connName]) {
        // TODO err
    }

    if (!this.active_connections[connName].clients[client_id]) {
        // TODO err
    }

    delete this.active_connections[connName].clients[client_id];

    if (Object.keys(this.active_connections[connName].clients).length === 0) {
        // no one is connected to this connection now

        // disconnect it
        this.active_connections[connName].conn.disconnect();

        // and remove it from active_connections
        // TODO add callback to disconnect and make this calls inside it:
        delete this.active_connections[connName];

        logger.debug("no one more is connected to " + connName);
    }

    callback();
}


ConnectionFactory.auto_detect = function(callback) {
    var that = this;

    function list() {
        var connections = [];

        // TODO take off this async behavior
        SerialConnection.auto_detect(function(serials) {
            connections = serials;
            connections = connections.concat(BogusConnection.auto_detect());
            logger.debug("Connections detected", {
                connections: connections
            })

            callback(connections);
        });

    };

    setTimeout(list, 500);
}

module.exports = ConnectionFactory;
