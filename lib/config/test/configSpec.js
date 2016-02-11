var expect = require("chai").expect;
var config = require("@config");

describe("config-config", function() {
    it("should define a logger", function() {
        expect(config).to.have.a.property("logger");
    });

    describe(".logger", function() {
        var logger = config.logger;
        it("should have stream property", function() {
            expect(logger).to.have.a.property("stream");
        });

        describe(".stream", function() {
            it("should have write method", function() {
                expect(logger.stream).to.have.a.property("write")
                    .which.is.a.function;
            });
        });

    });
});
