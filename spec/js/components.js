/*jshint asi: true, expr: true */

var assert = require('assert')
var sinon = require('sinon')
var chai = require('chai')
var expect = chai.expect
chai.use(require('sinon-chai'))

var components = require('../../public/js/components.js');
var sensor = components.sensor;
var pump = components.pump;

describe('component', function() {
  before(function(){
  });
  after(function(){
  }); 
  beforeEach(function(){
  });
  afterEach(function(){
  });

  describe('pump', function() {
    it('must be instantiated xxxxx', function() {
      expect(pump()).to.be.not.equal(pump());
    });
  });

}); // end tests
