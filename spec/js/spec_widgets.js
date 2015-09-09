/*jshint asi: true, expr: true */

var assert = require('assert')
var sinon = require('sinon')
var chai = require('chai')
var expect = chai.expect
chai.use(require('sinon-chai'))

var components = require('../../public/js/head/components.js');
var widgets = require('../../public/js/head/widgets.js');
var eventer = require('../../public/js/head/eventer.js').eventer;

describe('widget', function() {
  before(function(){
    var jquery = require('jquery');
    var myWindow = require('node-jsdom').jsdom('<html><head></head><body><div id="testParent"></div></body></html>',{url:'http://www.example.com'}).parentWindow;
    global.window = myWindow;
    global.$ = jquery(myWindow); 
  });
  after(function(){
    global.window = undefined; 
  });
  beforeEach(function(){ 

    this.$parent =  $('#testParent');
  });
  afterEach(function(){ 
    this.$parent.empty();
  }); 

  describe('eventedLevel', function() {
    it('triggers event_change when it increases or decreases', function(done) {
      var counter = 0;
      eventer({}).on('level_change', function() {
        counter ++; 
        if (counter === 1) done();
      });
      var evlo = widgets.eventedLevel(12);
      evlo.incr(1);
      evlo.decr(1);
    });
  });

  describe('liquidProbe', function() {
    it('gets created & initialize with a sensor and a named template containing a display of the threshold and a background color', function() {
      var probe = widgets.liquidProbe(components.sensorAbove(components.level(15), 12)).init(this.$parent, {bottom:0,left:0}).paint();
      var $probe = probe.domNode();
      expect($probe.hasClass('widget_container')).to.be.ok;
      expect($('.liquid_probe', $probe).length).to.be.equal(1);
      expect($('.sensor_threshold', $probe).text()).to.be.equal('12');
      expect($('.liquid_probe', $probe).css('background-color')).to.be.not.undefined;
    });
    it('features a vertical position that is independent from its threshold value (which is a pain)', function() {
      var sensorThreshold = 12;
      var probe = widgets.liquidProbe(components.sensorAbove(components.level(15), sensorThreshold)).init(this.$parent, {bottom:0,left:0}).paint();
      var $probe = probe.domNode();
      expect($probe.css('bottom')).to.be.not.equal(sensorThreshold + '');
    });
    it('has green bkg when the sensor function returns true', function() {
      var sensorThreshold = 16;
      var levelValue = 15;
      var probe = widgets.liquidProbe(components.sensorAbove(components.level(levelValue), sensorThreshold)).init(this.$parent, {bottom:0,left:0}).paint();
      var $probe = probe.domNode();
      expect($('.liquid_probe', $probe).css('background-color')).to.be.equal('green');
    }); 
    it('has red bkg when the sensor function returns false', function() {
      var sensorThreshold = 16;
      var levelValue = 17;
      var probe = widgets.liquidProbe(components.sensorAbove(components.level(levelValue), sensorThreshold)).init(this.$parent, {bottom:0,left:0}).paint();
      var $probe = probe.domNode();
      expect($('.liquid_probe', $probe).css('background-color')).to.be.equal('red');
    });
  });

  describe('positionalProbe (evented liquidProbe)', function() {
    it('features a vertical position that depends on its threshold value (which is GOOD)', function() {
      var sensorThreshold = 17;
      var evLevello = widgets.eventedLevel(15);
      var probe = widgets.positionalProbe(components.sensorAbove(evLevello, sensorThreshold), this.$parent, 50).paint();
      var $probe = probe.domNode(); 
      expect($probe.css('bottom')).to.be.equal(sensorThreshold - 15 + 'px');
    });
    it('reacts to level_change events triggered by its eventedLevel by changing background-color', function() {
      var sensorThreshold = 16;
      var levello = widgets.eventedLevel(15);
      var probe = widgets.positionalProbe(components.sensorAbove(levello, sensorThreshold), this.$parent, 50).paint();
      var $probe = probe.domNode();
      expect($('.liquid_probe', this.$parent).css('background-color')).to.be.equal('green');
      levello.incr(2);
      expect($('.liquid_probe', this.$parent).css('background-color')).to.be.equal('red');
    });
  });

  describe('pipe', function() {
    beforeEach(function() {
      this.evlevelUp = widgets.eventedLevel(55);
      this.volumeUp = components.volume(25000, this.evlevelUp);
      this.evlevelDown = widgets.eventedLevel(5);
      this.volumeDown = components.volume(25000, this.evlevelDown);
      this.flowConn = components.flow(this.volumeUp, this.volumeDown, 4000);      
    });
    it('gets created with a flow and an incline', function() {
      var flowPipe = widgets.pipe(this.flowConn, 'negative');
      expect(flowPipe.init).to.be.not.undefined;
      expect(flowPipe.paint).to.be.not.undefined;
      expect(flowPipe.repaint).to.be.not.undefined;
    }); 
    it('gets initialized inside the page as a diagonal line along with a display of the flowRate', function() {
      var flowPipe = widgets.pipe(this.flowConn, 'negative').init(this.$parent, {bottom:111,left:222,width:333,height:444}).paint();
      expect($('.pipe', this.$parent).hasClass('negative')).to.be.ok;
      expect($('.pipe_label', this.$parent).text()).to.be.equal('4000');
      var $container = $('.widget_container', this.$parent);
      expect($container.css('bottom')).to.be.equal('111px');
      expect($container.css('left')).to.be.equal('222px');
      expect($container.css('width')).to.be.equal('333px');
      expect($container.css('height')).to.be.equal('444px');
    });
    describe('whenever a level_change event is met', function() {
      it('gets class \'running\' if flow is on', function(done) {
        // pipe is on by default
        var flowPipe = widgets.pipe(this.flowConn, 'negative').init(this.$parent, {bottom:111,left:222,width:333,height:444}).paint();
        var counter = 0;
        var probe = eventer({});
        probe.on('level_change', function() {
          counter ++; 
          if (counter === 1) done();
        });
        probe.trigger('level_change');
        expect($('.pipe', this.$parent).hasClass('running')).to.be.ok;
      });
      it('gets class \'not_running\' if flow is off', function(done) {
        var flowPipe = widgets.pipe(this.flowConn, 'negative').init(this.$parent, {bottom:111,left:222,width:333,height:444}).paint();
        this.flowConn.switchOff();
        var counter = 0;
        var probe = eventer({}).on('level_change', function() {
          counter ++; 
          if (counter === 1) done();
        });
        probe.trigger('level_change');
        expect($('.pipe', this.$parent).hasClass('not_running')).to.be.ok;
      });
    });
  });

  describe('basin', function() {
    it('gets created with a volume, a scale volume_level/pixels and a template containing a display of the level', function() {
      var theBasin = widgets.basin(components.volume(1000, components.level(23)), {width:123,height:234,scale:1.2});
      expect(theBasin.init).to.be.not.undefined;
      expect(theBasin.paint).to.be.not.undefined;
      expect(theBasin.repaint).to.be.not.undefined;
    });
    it('gets initialized inside the page with a width and a height in pixels', function() {
      var dims = {
        width : 100,
        height : 200,
        scale : 2
      };
      var basinBottom = 12;
      var basinLeft = 34;
      var theBasin = widgets.basin(components.volume(1000, components.level(20)), dims).init(this.$parent, basinBottom, basinLeft).paint();

      expect($('.widget_container', this.$parent).css('bottom')).to.be.equal('12px');
      expect($('.widget_container', this.$parent).css('left')).to.be.equal('34px');
      expect($('.basin.outer', this.$parent).css('width')).to.be.equal('50px');
      expect($('.basin.outer', this.$parent).css('height')).to.be.equal('100px');
      expect($('.basin.inner', this.$parent).css('height')).to.be.equal('10px');
      expect($('.basin_level', this.$parent).text()).to.be.equal('20');
    });
    it('will return its dom elements to allow graphical nesting of probes inside', function() {
      var theBasin = widgets.basin(components.volume(1000, components.level(23)), {width:123,height:234,scale:1.2}).init(this.$parent, 0, 5).paint();
      expect(theBasin.domNode()[0].tagName.toLowerCase()).to.be.equal('div');
    });
  });

  describe('eventedBasin (evented basin)', function() {
    beforeEach(function() {
    var pos = {
      bottom : 100,
      left : 200
    };
    this.evlevello = widgets.eventedLevel(20);
    this.evBasin = widgets.eventedBasin(components.volume(100, this.evlevello), this.$parent, pos).paint();
    });
    it('gets initialized inside the page with scale 1:1 and dimensions dictated by the volume inside it', function() {
      expect($('.widget_container', this.$parent).css('bottom')).to.be.equal('100px');
      expect($('.widget_container', this.$parent).css('left')).to.be.equal('200px');
      expect($('.basin.outer', this.$parent).css('width')).to.be.equal('10px');  // sqrt(volume.area)
      expect($('.basin.outer', this.$parent).css('height')).to.be.equal('80px');  // default for basin
      expect($('.basin.inner', this.$parent).css('height')).to.be.equal('20px');
      expect($('.basin_level', this.$parent).text()).to.be.equal('20');
    });
    describe('whenever a level_change event is met', function() {
      it('increases its height in pixels and updates its display when the volume level increases or decreases', function(done) {
        var counter = 0;
        var probe = eventer({});
        probe.on('level_change', function() {
          counter ++; 
          if (counter === 2) done();
        });
        this.evlevello.incr(5);
        expect($('.basin.inner', this.$parent).css('height')).to.be.equal('25px');
        expect($('.basin_level', this.$parent).text()).to.be.equal('25');
        this.evlevello.decr(10);
        expect($('.basin.inner', this.$parent).css('height')).to.be.equal('15px');
        expect($('.basin_level', this.$parent).text()).to.be.equal('15');
      });
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
