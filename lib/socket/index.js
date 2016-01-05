var logger = require("@config").logger;

var init = function (server, app) {
    var io = require("socket.io")(server);

    io.on("connection", function(socket) {
        // we've got a client connection
        logger.info("new client connetion");

        socket.on('request_connections_available', function () {
            var update_connections_available = function (data) {
                socket.emit("update_connections_available", data);
            }
            app.pidController.auto_detect(update_connections_available);
        });

        socket.on("request_disconnection", disconnect);

        function disconnect(data, callback) {
            // TODO disconnect the associated pid controller
            logger.info("client disconnected");
            // TODO don't do that (see "request_connection")
            if (socket.connName) {
                app.pidController.disconnect(socket.id, socket.connName, function (err) {
                    // TODO
                    logger.info(socket.id + " disconnected from " + socket.connName);

                    // TODO duplicated from socket#unsubscribe
                    logger.info('leaving room', socket.connName);
                    socket.leave(socket.connName);

                    // TODO should have a function (and with a good name)
                    var conn_info = app.pidController.getInfo(socket.connName);
                    io.to(socket.connName).emit("update_conn_info", conn_info);

                    delete socket.connName;

                    if (typeof callback == 'function') {
                        callback(null);
                    }
                });

            }
        }

        socket.on("disconnect", disconnect);

        socket.on("request_connection", function(data, fn) {
            logger.info("received request to connect to: ", data.connName);
            // TODO don't do that
            socket.connName = data.connName;
            app.pidController.connect( socket.id,
                data.connName,
                function (message) {
                    io.to(data.connName).emit("new_controller_data", {message: message});
                },
                function (err) {
                    fn(err);
                    // TODO should this two calls be only one?:
                    var conn_info = app.pidController.getInfo(socket.connName);
                    socket.emit("update_conn_info", conn_info);
                    io.to(data.connName).emit("update_conn_info", conn_info);
                }
            );
        });

        socket.on('new_controller_parameters', function (new_controller_parameters) {
            // send new parameters to controller
            logger.debug("received new_controller_parameters", new_controller_parameters);
            app.pidController.send(socket.connName, new_controller_parameters);
        });
    });

    io.sockets.on('connection', function(socket){
        // Source: http://stackoverflow.com/a/16475058
        socket.on('subscribe', function(room) {
            logger.info('joining room', room);
            socket.join(room);
        });

        socket.on('unsubscribe', function(room) {
            logger.info('leaving room', room);
            socket.leave(room);
        });
    });

    return io;
}

module.exports = init;
