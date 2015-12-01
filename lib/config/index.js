var config = {
    serial: {
        baudrate: 9600,
    },
    server: {
        port: 8000
    },
    bogus_conn: {
        default_values: {
            comName: "/bogus",
            comType: "Bogus"
        },
        is_bogus_conn: function (connName) {
            return connName.localeCompare(this.default_values.comName) == 0;
        }
    }
}

// Source: http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
var winston = require('winston');
winston.emitErrs = true;

var log_path = require('path').join(process.cwd(), 'logs', 'all-logs.log');

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: log_path,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

config.logger = logger;
config.logger.stream = {
    write: function(message, encoding){
        logger.info(message.slice(0, -1));
    }
};

module.exports = config;
