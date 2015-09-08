/*jshint asi: true, expr: true */

var assert = require('assert')
var sinon = require('sinon')
var chai = require('chai')
var expect = chai.expect
chai.use(require('sinon-chai'))

var components = require('../../public/js/head/components.js');
var widgets = require('../../public/js/head/widgets.js');

describe('widget', function() {
  before(function(){
    var jquery = require('jquery');
    var myWindow = require('node-jsdom').jsdom('<html><head></head><body><div id="testParent"></div></body></html>',{url:'http://www.example.com'}).parentWindow;
    global.window = myWindow;
    global.$ = jquery(myWindow); 

    this.$parent =  $('#mubiParent');
  });
  after(function(){
    global.window = undefined; 
  });
  beforeEach(function(){ });
  afterEach(function(){ }); 

  describe('liquidProbe', function() {
    it('gets created with a sensor and a circular template containing a display of the threshold', function() {
      var probe = widgets.liquidProbe(components.sensorAbove(components.level(15),12)).init(this.$parent, {bottom:0,left:0}).paint();
      var $probe = probe.domNode();
      expect($probe.hasClass('widget_container')).to.be.ok;
      expect($('.liquid_probe',$probe).length).to.be.equal(1);
      expect($('.sensor_threshold',$probe).text()).to.be.equal('12');
    });
    it('gets initialized inside the page with a background color', function() {

    });
    describe('whenever a level_change event is met', function() {
      it('has green bkg when the sensor function returns true', function() {

      }); 
      it('has red bkg when the sensor function returns false', function() {

      });
    });
  });
  describe('positionalProbe (evented liquidProbe)', function() {
    it('reacts to repaint events triggered by its eventedLevel', function() {
    });
  });

  describe('pipe', function() {
    it('gets created with a flow and an incline', function() {

    });
    it('gets initialized inside the page as a diagonal line along with a display of the flowRate', function() {

    });
    describe('whenever a level_change event is met', function() {
      it('gets class \'not_running\' if flow is off', function() {

      });
      it('gets class \'running\' if flow is on', function() {

      });
    });
  });

  describe('basin', function() {
    it('gets created with a volume, a scale volume_level/pixels and a rectangular template containing a display of the level', function() {

    });
    it('gets initialized inside the page with a width and a height in pixels', function() {

    });
    describe('whenever a level_change event is met', function() {
      it('increases its height in pixels and updates its display when the volume level increases', function() {

      });
      it('decreases its height in pixels and updates its display when the volume level decreases', function() {

      });
    });
  });
  describe('eventedBasin (evented basin)', function() {
    it('reacts to repaint events triggered by the eventedLevel of its volume', function() {
    });
  });

  describe('pumpWidget', function() {
    it('gets created with ...', function() {

    });
    describe('whenever a level_change event is met', function() {
      it('gets green bkg when it\' running', function() {

      });
      it('gets red bkg when it is not running', function() {

      });
    });
  });
  describe('eventedPumpWidget (not yet existing)',function(){
    it.skip('binds the pump onTick to a global tick event', function() {});
  });

  // pump, basin and two sensors
  describe('feedbackSystem',function(){}); 

}); // end tests
