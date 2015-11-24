var config = {
    serial: {
        baudrate: 9600,
    },
    server: {
        port: 8000
    },
    bogus_conn: {
        default_values: {
            comName: "bogus"
        },
        is_bogus_conn: function (connName) {
            return connName.localeCompare(this.default_values.comName) == 0;
        }
    }
}

module.exports = config;
