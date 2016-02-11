var expect = require("chai").expect;

var config_bogus = require("@config").bogus_conn;

var conn = require("@connection");
var bogus_conn = require("../bogus_conn");

describe("connection", function() {
    it("should have active_connections empty object", function() {
        expect(conn).to.have.a.property("active_connections")
            .that.is.an("object")
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

    describe(".auto_detect()", function () {
        it("call callback", function (done) {
            conn.auto_detect(function (conns) {
                expect(conns).to.be.an("array").not.empty;
                done();
            });
        });
    });
});

describe("bogus_conn", function() {
    it("should have auto_detect method", function() {
        expect(bogus_conn).to.have.a.property("auto_detect")
            .which.is.a.function;
    });

    describe(".auto_detect()", function () {
        it("return default bogus connection", function () {
            var conns = bogus_conn.auto_detect();
            expect(conns).to.be.an("array")
                .with.length(1)
                .and.with.deep.property("[0]")
                    .that.is.an("object")
                    .and.is.deep.equals(config_bogus.default_values);
        });
    });
});
