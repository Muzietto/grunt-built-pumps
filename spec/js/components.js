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
  before(function(){ });
  after(function(){ }); 
  beforeEach(function(){ });
  afterEach(function(){ });

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
      var v0 = volume(1.0012345,level(1.0012345));
      expect(v0.value()).to.be.equal(1);
      var v1 = volume(1.0012345,level(1.012345));
      expect(v1.value()).to.be.equal(1.01);
      var v3 = volume(10.0012345,level(10.0012345));
      expect(v3.value()).to.be.equal(100);
    });
    it('can be increased and decreased by 0.01 (ten decimillis)', function() {
      var l0 = level(1)
      var v0 = volume(1, l0);
      expect(v0.value()).to.be.equal(1);
      v0.incr();
      expect(v0.value()).to.be.equal(1.01);
      expect(l0.value()).to.be.equal(1.01);
      v0.decr();
      expect(v0.value()).to.be.equal(1);
      expect(l0.value()).to.be.equal(1);
      v0.incr(0.01);
      expect(v0.value()).to.be.equal(1.01);
      expect(l0.value()).to.be.equal(1.01);
      v0.decr(0.01);
      expect(v0.value()).to.be.equal(1);
      expect(l0.value()).to.be.equal(1);
      v0.incr(0.006);
      expect(v0.value()).to.be.equal(1.01);
      expect(l0.value()).to.be.equal(1.01);
      v0.decr(0.006);
      expect(v0.value()).to.be.equal(1);
      expect(l0.value()).to.be.equal(1);
      v0.incr(0.004);
      expect(v0.value()).to.be.equal(1);
      expect(l0.value()).to.be.equal(1);
      v0.decr(0.004);
      expect(v0.value()).to.be.equal(1);
      expect(l0.value()).to.be.equal(1);
    });
    it('can be increased and decreased by n.nn (tens of decimillis)', function() {
      var l0 = level(1)
      var v0 = volume(1, l0);
      expect(v0.value()).to.be.equal(1);
      v0.incr(1.01);
      expect(v0.value()).to.be.equal(2.01);
      expect(l0.value()).to.be.equal(2.01);
      v0.decr(1.01);
      expect(v0.value()).to.be.equal(1);
      expect(l0.value()).to.be.equal(1);

      var l1 = level(10)
      var v1 = volume(10, l1);
      expect(v1.value()).to.be.equal(100);
      v1.incr(1.01);
      expect(v1.value()).to.be.equal(101);
      expect(l1.value()).to.be.equal(10.1);
      v1.decr(1.01);
      expect(v1.value()).to.be.equal(100);
      expect(l1.value()).to.be.equal(10);

      var l2 = level(10.1)
      var v2 = volume(10, l2);
      expect(v2.value()).to.be.equal(101);
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
