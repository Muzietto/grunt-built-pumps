/*jshint asi: true, expr: true */

var assert = require('assert')
var sinon = require('sinon')
var chai = require('chai')
var expect = chai.expect
chai.use(require('sinon-chai'))

var components = require('../../public/js/head/components.js');
var widgets = require('../../public/js/head/widgets.js');

var level = components.level;
var volume = components.volume;
var sensor = components.sensor;
var sensorAbove = components.sensorAbove;
var sensorBelow = components.sensorBelow;
var pump = components.pump;
var flow = components.flow;

describe('component', function() {
  before(function(){ });
  after(function(){ }); 
  beforeEach(function(){ });
  afterEach(function(){ });

  describe('level', function() {
    it('can be created with starting value or with default zero', function() {
      var level1 = level();
      expect(level1.value()).to.be.equal(0);
      var level2 = level(123);
      expect(level2.value()).to.be.equal(123);
    });
    it('expects values to incr and decr to be always specified', function() {
      var level0 = level();
      expect(level0.incr.bind(level0, undefined)).to.throw();
      expect(level0.decr.bind(level0, undefined)).to.throw();
    });
    it('can be increased or decreased by n', function() {
      var level1 = level(0);
      expect(level1.value()).to.be.equal(0);
      level1.incr(12);
      expect(level1.value()).to.be.equal(12);
      level1.decr(2);
      expect(level1.value()).to.be.equal(10);
    });
    it('handles max precision 1e-2', function() {
      var level0 = level(0.012345);
      expect(level0.value()).to.be.equal(0.01);
      
      var level1 = level();
      expect(level1.value()).to.be.equal(0);
      level1.incr(12.12345);
      expect(level1.value()).to.be.equal(12.12);
      level1.decr(2.0012345);
      expect(level1.value()).to.be.equal(10.12);      
    });
    it('handles negative increases and positive decreases', function() {
      var level1 = level(20);
      level1.incr(-12); 
      expect(level1.value()).to.be.equal(8);
      level1.decr(-12); 
      expect(level1.value()).to.be.equal(20);
    });
    it('cannot go under 0', function() {
      var level1 = level(10);
      level1.decr(12); 
      expect(level1.value()).to.be.equal(0);

      var level2 = level(10);
      level2.incr(-12); 
      expect(level2.value()).to.be.equal(0);
    });
    it('always returns the actual delta', function() {
      var level1 = level(0);
      expect(level1.value()).to.be.equal(0);
      
      expect(level1.incr(12)).to.be.equal(12);
      expect(level1.value()).to.be.equal(12);
      expect(level1.decr(2)).to.be.equal(-2);
      expect(level1.value()).to.be.equal(10);

      expect(level1.incr(-2)).to.be.equal(-2);
      expect(level1.value()).to.be.equal(8);
      expect(level1.decr(-2)).to.be.equal(2);
      expect(level1.value()).to.be.equal(10);
      
      expect(level1.decr(12)).to.be.equal(-10);
      expect(level1.value()).to.be.equal(0);
      });
  });

  describe('volume', function() {
    it('has a base area and a level with precision 1e-2', function() {
      var volume0 = volume(1.0012345,level(1.0012345));
      expect(volume0.value()).to.be.equal(1);
      var volume1 = volume(1.0012345,level(1.012345));
      expect(volume1.value()).to.be.equal(1.01);
      var v3 = volume(10.0012345,level(10.0012345));
      expect(v3.value()).to.be.equal(100);
    });
    it('expects values to incr and decr to be always specified', function() {
      var level0 = level(1)
      var volume0 = volume(1, level0);
      expect(volume0.value()).to.be.equal(1);
      expect(volume0.incr.bind(volume0, undefined)).to.throw();
      expect(volume0.decr.bind(volume0, undefined)).to.throw();
    });
    it('can be increased and decreased by 0.01 (ten decimillis)', function() {
      var level0 = level(1)
      var volume0 = volume(1, level0);
      expect(volume0.value()).to.be.equal(1);
      volume0.incr(0.01);
      expect(volume0.value()).to.be.equal(1.01);
      expect(level0.value()).to.be.equal(1.01);
      volume0.decr(0.01);
      expect(volume0.value()).to.be.equal(1);
      expect(level0.value()).to.be.equal(1);
      volume0.incr(0.006);
      expect(volume0.value()).to.be.equal(1.01);
      expect(level0.value()).to.be.equal(1.01);
      volume0.decr(0.006);
      expect(volume0.value()).to.be.equal(1);
      expect(level0.value()).to.be.equal(1);
      volume0.incr(0.004);
      expect(volume0.value()).to.be.equal(1);
      expect(level0.value()).to.be.equal(1);
      volume0.decr(0.004);
      expect(volume0.value()).to.be.equal(1);
      expect(level0.value()).to.be.equal(1);
    });
    it('can be increased and decreased by n.nn (tens of decimillis)', function() {
      var level0 = level(1);
      var volume0 = volume(1, level0);
      expect(volume0.value()).to.be.equal(1);
      volume0.incr(1.01);
      expect(volume0.value()).to.be.equal(2.01);
      expect(level0.value()).to.be.equal(2.01);
      volume0.decr(1.01);
      expect(volume0.value()).to.be.equal(1);
      expect(level0.value()).to.be.equal(1);

      var level1 = level(10);
      var volume1 = volume(10, level1);
      expect(volume1.value()).to.be.equal(100);
      volume1.incr(1.01);
      expect(volume1.value()).to.be.equal(101);
      expect(level1.value()).to.be.equal(10.1);
      volume1.decr(1.01);
      expect(volume1.value()).to.be.equal(100);
      expect(level1.value()).to.be.equal(10);

      var level2 = level(10.1);
      var volume2 = volume(10, level2);
      expect(volume2.value()).to.be.equal(101);
    });
    it('can be increased/decreased through its level', function() {
      var level1 = level(10);
      var volume1 = volume(10, level1);
      level1.incr(1);
      expect(volume1.value()).to.be.equal(110);      
    });
    it('cannot go under zero', function() {
      var level1 = level(10);
      var volume1 = volume(10, level1);
      volume1.decr(102);
      expect(volume1.value()).to.be.equal(0);
      level1.incr(1);
      expect(volume1.value()).to.be.equal(10);
      level1.decr(2);
      expect(volume1.value()).to.be.equal(0);
    });
    it('always returns the actual volume delta', function() {
      var level0 = level(1);
      var volume0 = volume(1, level0);
      expect(volume0.value()).to.be.equal(1);

      expect(volume0.incr(1.01)).to.be.equal(1.01);
      expect(volume0.value()).to.be.equal(2.01);
      expect(level0.value()).to.be.equal(2.01);

      expect(volume0.decr(1.01)).to.be.equal(-1.01);
      expect(volume0.value()).to.be.equal(1);
      expect(level0.value()).to.be.equal(1);

      expect(volume0.decr(2)).to.be.equal(-1);
      expect(volume0.value()).to.be.equal(0);
      expect(level0.value()).to.be.equal(0);
      });
    it('returns its area and level value when asked', function() {
      expect(volume(110, level(23)).area()).to.be.equal(110);      
      expect(volume(110, level(23)).levelValue()).to.be.equal(23);      
    });
  });

  describe('sensor', function() {
    it('may go off when its level is > threshold', function() {
      var level0 = level(5);
      var sensor0 = sensorAbove(level0, 5);
      expect(sensor0()).to.be.not.ok;
      level0.incr(0.01);
      expect(sensor0()).to.be.ok;
      level0.decr(0.01);
      expect(sensor0()).to.be.not.ok;

      var s1 = sensor(level0, 5);
      expect(s1()).to.be.not.ok;
      level0.incr(0.01);
      expect(s1()).to.be.ok;
    });
    it('may go off when its level is < threshold', function() {
      var level0 = level(5);
      var sensor0 = sensorBelow(level0, 5);
      expect(sensor0()).to.be.not.ok;
      level0.decr(0.01);
      expect(sensor0()).to.be.ok;
    });
    it('provides a getter for its threshold', function() {
      var level0 = level(5);
      var sensor0 = sensorBelow(level0, 6);
      expect(sensor0.threshold()).to.be.equal(6);
    });  });

  describe('pump', function(){
    it('may be on or off depending on what its sensor senses', function() {
      var level0 = level();
      var volume0 = volume(10, level0);
      var sensor0 = sensor(level0)
      var pump0 = pump(volume0, sensor0);
      expect(pump0.running()).to.be.not.ok;
      
      level0.incr(0.01);
      expect(pump0.running()).to.be.ok;
    });
    it('pumps OUT the volume depending on its flow rate', function() {
      var level0 = level(5.01);
      var volume0 = volume(10, level0);
      var sensor0 = sensorAbove(level0, 5);
      var pump0 = pump(volume0, sensor0, 1); // draining OUT
      expect(volume0.value()).to.be.equal(50.1);
      expect(level0.value()).to.be.equal(5.01);

      pump0.onTick(); // 1/10 s
      expect(volume0.value()).to.be.equal(50);
      expect(level0.value()).to.be.equal(5);      

      pump0.onTick(); // no longer running
      expect(volume0.value()).to.be.equal(50);
      expect(level0.value()).to.be.equal(5);      
    });
    it('is unidirectional, but it pumps both ways', function(){
      var level0 = level(5);
      var volume0 = volume(10, level0);
      var sensor0 = sensorBelow(level0, 6);
      var pump0 = pump(volume0, sensor0, -1);

      pump0.onTick(); // 1/10 s
      expect(volume0.value()).to.be.equal(50.1);
      expect(level0.value()).to.be.equal(5.01);
    });
    it('pumps away only available water', function(){
      var level0 = level(0.9);
      var volume0 = volume(10, level0);
      var sensor0 = sensorBelow(level0, 6);
      var level1 = level(0);
      var volume1 = volume(10, level1);
      // could pump more water than volume0 contains
      var pump0 = pump(volume0, sensor0, 100, volume1);

      expect(volume0.value()).to.be.equal(9);
      expect(level0.value()).to.be.equal(0.9);
      expect(volume1.value()).to.be.equal(0);
      expect(level1.value()).to.be.equal(0);

      pump0.onTick(); // 1/10 s
      expect(volume0.value()).to.be.equal(0);
      expect(level0.value()).to.be.equal(0);
      expect(volume1.value()).to.be.equal(9);
      expect(level1.value()).to.be.equal(0.9);
    });
  });

  describe('flow', function() {
    it('is a pump initially on with a given flowRate', function() {
      var level1 = level(10);
      var volume1 = volume(10, level1);

      var flow0 = flow(volume1, null, 10); // no sink, pull water
      flow0.onTick();
      expect(level1.value()).to.be.equal(9.9);
    });
    it('may be turned off and on at will', function() {
      var level1 = level(10);
      var volume1 = volume(10, level1);

      var flow0 = flow(volume1, null, 10); // no sink, pull water
      flow0.switchOff();
      flow0.onTick();
      expect(level1.value()).to.be.equal(10);
      flow0.switchOn();
      flow0.onTick();
      expect(level1.value()).to.be.equal(9.9);
    });
    it('carries liquid as much as there is', function() {
      var level1 = level(9);
      var volume1 = volume(1, level1);
      var level2 = level(10);
      var volume2 = volume(1, level2);
      var flow0 = flow(volume1, volume2, 1000); // bring water from volume1 into volume2

      flow0.onTick();
      expect(level1.value()).to.be.equal(0);
      expect(volume1.value()).to.be.equal(0);
      expect(level2.value()).to.be.equal(19);
      expect(volume2.value()).to.be.equal(19);
      expect(volume2.levelValue()).to.be.equal(19);

      flow0.onTick();
      expect(level2.value()).to.be.equal(19);
      expect(volume2.levelValue()).to.be.equal(19);
      expect(volume2.value()).to.be.equal(19);
    });
    it.skip('is bidirectional', function() {
      // TODO - implement me - check absolute value of the basin levels
    });
  });
}); // end tests
