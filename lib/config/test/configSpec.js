var expect = require("chai").expect;
var config = require("_/config");

describe("config", function() {
    it("should have serial property", function() {
        expect(config).to.have.a.property("serial");
    });
    it("should have server property", function() {
        expect(config).to.have.a.property("server");
    });
    it("should have bogus_conn property", function() {
        expect(config).to.have.a.property("bogus_conn");
    });

    describe(".serial", function() {
        var serial = config.serial;

        it("should have baudrate property", function() {
            expect(serial).to.have.a.property("baudrate");
        });
    });

    describe(".server", function() {
        var server = config.server;
        it("should have baudrate property", function() {
            expect(server).to.have.a.property("port");
        });
    });

    describe(".bogus_conn", function() {
        var bogus_conn = config.bogus_conn;
        it("should have default_values property", function() {
            expect(bogus_conn).to.have.a.property("default_values");
        });

        it("should have is_bogus_conn method", function() {
            expect(bogus_conn).to.have.a.property("is_bogus_conn");
        });

        describe(".is_bogus_conn()", function() {
            it("should compare to true with bogus_conn default connName", function() {
                var default_connName = bogus_conn.default_values.comName;
                var comp = bogus_conn.is_bogus_conn(default_connName);
                expect(comp).to.be.true;
            });

            it("should compare to false with random connName", function() {
                var connName = "random";
                var comp = bogus_conn.is_bogus_conn(connName);
                expect(comp).to.be.false;
            });
        });

    });
});
