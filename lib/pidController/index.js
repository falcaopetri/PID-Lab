var connection = require("_/connection");


var PIDController = {
    auto_detect: connection.auto_detect,

    connect: function (connName, success, error) {
        this.auto_detect(function (what, connsAvailable) {
            console.log(connsAvailable);
            if (connsAvailable.indexOf(connName) == -1) {
                // error
                error();
            }
        });
    }
    //
    //
    // serial: new connection.SerialConnection("/dev/ttyACM0", {
    //     data_received: function(data) {
    //         try {
    //             JSON.parse(data.toString());
    //             console.log("d: " + data);
    //         }
    //         catch(err) {
    //             console.log(err);
    //         }
    //     }
    // })
};

// PIDController.serial.connect();
module.exports = PIDController;
