var expect = require("chai").expect;
var conn = require("@connection");

describe("connection", function() {
    it("should have active_connections empty array", function() {
        expect(conn).to.have.a.property("active_connections")
            .that.is.an("array")
            .and.empty;
    });

    it("should have connect method", function() {
        expect(conn).to.have.a.property("connect")
            .which.is.a.function;
    });

    it("should have auto_detect method", function() {
        expect(conn).to.have.a.property("auto_detect")
            .which.is.a.function;
    });
});
