/*jshint asi: true, expr: true */

var assert = require('assert')
var sinon = require('sinon')
var chai = require('chai')
var expect = chai.expect
chai.use(require('sinon-chai'))

var components = require('../../public/js/components.js');
var widgets = require('../../public/js/widgets.js');

var level = components.level;
var volume = components.volume;
var sensor = components.sensor;
var sensorAbove = components.sensorAbove;
var sensorBelow = components.sensorBelow;
var pump = components.pump;

describe('widget', function() {
  before(function(){
  });
  after(function(){
  });
  beforeEach(function(){ });
  afterEach(function(){ });

  describe('liquidProbe', function() {
    it('gets created with a sensor and a circular template containing a display of the threshold', function() {
      
    });
    it('gets initialized inside the page with a background color', function() {
      
    });
    describe('once started it', function() {
      it('has green bkg when the sensor function returns true', function() {
        
      });
      it('has red bkg when the sensor function returns false', function() {
        
      });
    });
  });
  describe('basin', function() {
    it('gets created with a volume, a scale volume_level/pixels and a rectangular template containing a display of the level', function() {
      
    });
    it('gets initialized inside the page with a width and a height in pixels', function() {
      
    });
    describe('once started it', function() {
      it('increases its height in pixels and updates its display when the volume level increases', function() {
        
      });
      it('decreases its height in pixels and updates its display when the volume level decreases', function() {
        
      });
    });
  });
 
  
}); // end tests
