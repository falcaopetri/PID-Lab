var expect = require("chai").expect;
var config = require("@config");

describe("socket-config", function() {
    it("should have server property", function() {
        expect(config).to.have.a.property("server");
    });

    describe(".server", function() {
        var server = config.server;
        it("should have port property", function() {
            expect(server).to.have.a.property("port");
        });
    });
});
