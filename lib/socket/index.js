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

        socket.on("disconnect", function() {
            // TODO disconnect the associated pid controller
            logger.info("client disconnected");
        });

        socket.on("request_connection", function(data, fn) {
            logger.info("received request to connect to: ", data.connName);
            app.pidController.connect(data.connName,
                function (message) {
                    io.to(data.connName).emit("new_controller_data", {message});
                },
                function (err) {
                    fn(!err);
                }
            );
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
