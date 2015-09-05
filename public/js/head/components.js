
var COMPONENTS = (function () {
  'use strict'; 

  function level(start) {
    var _level = centify(start) || 0;
    var handleDelta = function(operator, val) {
      if (typeof val === 'undefined') throw 'must specify level increase/decrease value';
      var result = _level;
      _level = operator(_level, centify(val) || 1);
      reset();
      return (_level - result)/100;
    };
    return {
      value : function() {
        return _level/100;
      },
      incr : function(val) {
        return handleDelta(function(a, b) { return a + b; }, val);
      },
      decr : function(val) {
        return handleDelta(function(a, b) { return a - b; }, val);
      }
    };
    function reset() {
      if (_level < 0) { _level = 0; }
    }
  }

  function volume(area, level) {
    return {
      value : function() {
        return decimillifyVolume()/10000;
      },
      incr : function(val) {
        return handleDelta(val, level.incr);
      },
      decr : function(val) {
        return handleDelta(val, level.decr);
      },
      area : function() {
        return area;
      },
      levelValue : function() {
        return level.value();
      }
    };

    function handleDelta(val, handler) {
      var _val = val ? centify(val) : 1;
      if (_val !== 0) {
        return handler(_val/centify(area)) * area;
      }
      return 0;
    }
    function decimillifyVolume() {
      return centify(area) * centify(level.value());
    }
  }

  function centify(val) { return Math.round(val * 100); }
  function decimillify(val) { return Math.round(val * 10000); }
  function gt(a, b) { return a > b; }
  function lt(a, b) { return a < b; }

  function _sensor(level, threshold, comparator) {
    comparator = comparator || gt;
    var result = function sensor() {
      return comparator(level.value(), threshold || 0);
    };
    result.threshold = function() { return threshold; };
    return result;
  }

  function sensorAbove() {
    return function(level, threshold) {
      return _sensor(level, threshold, gt);
    };
  }
  function sensorBelow() {
    return function(level, threshold) {
      return _sensor(level, threshold, lt);
    };
  }

  // flowRate > 0 ==> REMOVE water
  function pump(source, sensor, flowRate, sink) {
    var result = {
      running : function() {
        return sensor();
      },
      onTick : function() { 
        if (this.running()) {
          var volume = -source.decr(flowRate/10);
          if (sink && volume !== 0) sink.incr(volume);
        }
      }
    };
    return result; 
  }

  function flow(source, sink, flowRate) {
    return pump(source, function() { return true; }, flowRate, sink);
  }

  return {
    level: level,
    volume: volume,
    flow: flow,
    sensor: sensorAbove(),
    sensorAbove: sensorAbove(),
    sensorBelow: sensorBelow(),
    pump: pump
  };
}());

if (typeof module === 'object' && typeof module.exports !== 'undefined') {
  module.exports = COMPONENTS;
}