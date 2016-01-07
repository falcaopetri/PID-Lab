var fs = require("fs");
var video_config = require("@config").video;
var logger = require("@config").logger;

var camStream = {
    active_connections: {},

    initStream: function(config) {
        return require('child_process').spawn("ffmpeg", [
            "-re", "-y",
            "-i", config.device,
            "-s", config.resolution,
            "-r", config.fps,
            "-f", "mjpeg",
            "pipe:1"
        ]);
    },

    stopStream: function(client_id) {
        for (var device in this.active_connections){
            var index = this.active_connections[device].clients.indexOf(client_id);

            if (index != -1) {
                this.active_connections[device].clients.splice(index, 1);

                // check if there is somebody still connected to the stream
                // or if we can close the ffmpeg process
                if (this.active_connections[device].clients.length == 0) {
                    logger.debug("no one more is connected to " + this.active_connections[device].config.device);

                    this.active_connections[device].stream.kill('SIGINT');

                    delete this.active_connections[device].stream;
                    delete this.active_connections[device];
                }
            }
        }
    },

    requestStream: function(client_id, data_callback, config) {
        config = config || {};

        for (var attrname in video_config.default_stream) {
            if (typeof config[attrname] == 'undefined') {
                config[attrname] = video_config.default_stream[attrname]
            }
        }

        if (config.device in this.active_connections) {
            this.active_connections[config.device].clients.push(client_id);
        } else {
            logger.debug("initing video stream on " + config.device);

            var ffmpeg = this.initStream(config);

            this.active_connections[config.device] = {
                stream: ffmpeg,
                clients: [],
                config: config
            };

            this.active_connections[config.device].clients.push(client_id);

            // TODO set correctly these callbacks
            // ffmpeg.on('error', function(err) {
            //     throw err;
            // });
            //
            // ffmpeg.on('close', function(code) {
            //     console.log('ffmpeg exited with code ' + code);
            // });
            //
            // ffmpeg.stderr.on('data', function(data) {
            //     // console.log('stderr: ' + data);
            // });

            var that = this;
            ffmpeg.stdout.on('data', function(data) {
                var buffer = new Buffer(data);
                data_callback(buffer);
            });
        }

        logger.debug(client_id + " is now connected to " + config.device);
    }
}

module.exports = camStream;
