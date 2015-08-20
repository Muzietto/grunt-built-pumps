/*jshint asi: true, expr: true */

var assert = require("assert")
var sinon = require("sinon")
var chai = require("chai")
var expect = chai.expect

chai.use(require("sinon-chai"))

describe("smartphone client", function() {
  before(function(){
  });

  after(function(){
  });

  describe("instantiation", function() {
    it("must be instantiated with a server as first parameter", function() {
      expect(1+3).to.be.equal(4);
    });

    it("can be instantiated with optional state", function() {
      var server = {};
      var state = { container: { status: "dummy" } };
      expect(true).to.be.ok;
      expect(false).to.be.not.ok;
    });
  });

}); // end tests
