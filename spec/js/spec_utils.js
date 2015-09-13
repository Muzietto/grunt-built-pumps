/*jshint asi: true, expr: true */

var assert = require('assert')
var sinon = require('sinon')
var chai = require('chai')
var expect = chai.expect
chai.use(require('sinon-chai'))

require('../../public/js/utils/helpers.js');
var eventer = require('../../public/js/head/eventer.js').eventer; 

describe('eventer', function() {
  beforeEach(function() {
    this.eventer = eventer();
  });
  afterEach(function() {
    eventer.clear();
  });

  it('should listen to an event triggered by itself', function(done) {
    this.eventer.on('event', function() {
      done();
    })
    this.eventer.trigger('event');
  });

  it('should listen to a triggered event with payload', function(done) {
    var dummy = {}
    this.eventer.on('event', function(payload) {
      expect(payload).to.be.equal(dummy);
      done();
    })
    this.eventer.trigger('event', dummy);
  });

  it('should do nothing if triggered event has no listener', function() {
    this.eventer.trigger('event');
  });

  it('should listen with multiple callbacks', function(done) {

    var check = count(2, done)
    this.eventer.on('event', function() { check(); })
    this.eventer.on('event', function() { check(); });

    this.eventer.trigger('event');
  });

  describe('on an existing object', function() {
    it('should work', function(done) {
      var object = {};
      eventer(object);
      object.on('event1', function() { done(); });
      object.trigger('event1');
    });

    it('should work on prototype', function(done) {
      var Dummy = function() {}
      var dummy = new Dummy()
      eventer(Dummy.prototype)
      dummy.on('event', function() { done() })
      dummy.trigger('event')
    });

    it('should not apply itself twice', function() {
      var object = {};
      eventer(object);
      object.trigger = undefined;  // little trick
      eventer(object);
      expect(object.trigger).to.be.undefined;
    });
  });

  describe('on two or more objects', function() {
    it('should react on events triggered by other objects', function(done) {
      var listener = {};
      var trigger = {};
      eventer(listener);
      eventer(trigger);
      listener.on('event', function(payload) { payload(); });
      trigger.trigger('event', done);
    });

    it('should react on events triggered at global level', function(done) {
      var listener1 = {};
      var listener2 = {};
      eventer(listener1);
      eventer(listener2);

      var check = count(2, done)
      listener1.on('event', function() { check(); })
      listener2.on('event', function() { check(); });
      eventer.trigger('event');
    });

    describe('in case of uuid-labeled events', function() {
      beforeEach(function() {
        this.one = eventer({});
        this.two = eventer({});
        this.three = eventer({});
      });
      it('should listen to its own single publisher', function (done) {
        var check = count(1, done);
        var listener = eventer({}, this.one);
        listener.onLocal('event', function () {
          check();
        });

        this.one.trigger('event');
        this.two.trigger('event');
        this.three.trigger('event');
      });
      it('should listen to its own list of publishers', function (done) {
        var check = count(2, done);
        var listener = eventer({}, [this.one, this.two]);
        listener.onLocal('event', function () {
          check();
        });

        this.one.trigger('event');
        this.two.trigger('event');
        this.three.trigger('event');
      });
    });

  });

  function count(times, done) {
    var ok = 0;
    return function() {
      ok += 1
      if (ok === times) { done(); }
      if (ok > times) { throw 'callback invoked too many times'; }
    };
  }
});
