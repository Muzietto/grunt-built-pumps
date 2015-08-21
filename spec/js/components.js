/*jshint asi: true, expr: true */

var assert = require('assert')
var sinon = require('sinon')
var chai = require('chai')
var expect = chai.expect
chai.use(require('sinon-chai'))

var components = require('../../public/js/components.js');
var level = components.level;
var volume = components.volume;
var sensor = components.sensor;
var sensorAbove = components.sensorAbove;
var sensorBelow = components.sensorBelow;
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

  describe('level', function() {
    it('can be created with starting value or with default zero', function() {
      var l1 = level();
      expect(l1.value()).to.be.equal(0);
      var l2 = level(123);
      expect(l2.value()).to.be.equal(123);
    });
    it('can be increased or decreased by 0.01', function() {
      var ll = level();
      expect(ll.value()).to.be.equal(0);
      ll.incr();
      expect(ll.value()).to.be.equal(0.01);
      ll.decr();
      expect(ll.value()).to.be.equal(0);
    });
    it('can be increased or decreased by n', function() {
      var ll = level();
      expect(ll.value()).to.be.equal(0);
      ll.incr(12);
      expect(ll.value()).to.be.equal(12);
      ll.decr(2);
      expect(ll.value()).to.be.equal(10);
    });
    it('handles max precision 1e-2', function() {
      var l0 = level(0.012345);
      expect(l0.value()).to.be.equal(0.01);
      
      var l1 = level();
      expect(l1.value()).to.be.equal(0);
      l1.incr(12.12345);
      expect(l1.value()).to.be.equal(12.12);
      l1.decr(2.0012345);
      expect(l1.value()).to.be.equal(10.12);
      
    });
  });
  
  describe('volume', function() {
    it('has a base area and a level with precision 1e-2', function() {
      var v0 = volume(10.0012345,level(5.0012345));
      expect(v0.value()).to.be.equal(50);
    });
    it('can be increased and decreased by 0.0001', function() {
      var l0 = level(5)
      var v0 = volume(10, l0);
      expect(v0.value()).to.be.equal(50);
      v0.incr();
      expect(v0.value()).to.be.equal(50.0001);
      expect(l0.value()).to.be.equal(5);
      v0.decr();
      expect(v0.value()).to.be.equal(50);
      expect(l0.value()).to.be.equal(5);
    });
    it('cannot go under zero', function() {
      
    });
  });

  describe('sensor', function() {
    it('may go off when its level is > threshold', function() {
      var l0 = level(5);
      var s0 = sensorAbove(l0,5);
      expect(s0()).to.be.not.ok;
      l0.incr();
      expect(s0()).to.be.ok;
      l0.decr();
      expect(s0()).to.be.not.ok;

      var s1 = sensor(l0,5);
      expect(s1()).to.be.not.ok;
      l0.incr();
      expect(s1()).to.be.ok;
    });
    it('may go off when its level is < threshold', function() {
      var l0 = level(5);
      var s0 = sensorBelow(l0,5);
      expect(s0()).to.be.not.ok;
      l0.decr();
      expect(s0()).to.be.ok;
    });
  });
  
  describe('pump', function(){
    it('may be on or off depending on what its sensor senses', function() {
      var l0 = level();
      var s0 = sensor(l0)
      var p0 = pump(l0, s0);
      expect(p0.on()).to.be.not.ok;
      
      l0.incr();
      expect(p0.on()).to.be.ok;
    });
  });

}); // end tests
