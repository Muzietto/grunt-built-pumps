
module.exports = (function () {
  'use strict'; 

  function level(start) {
    var _level = centify(start) || 0;
    return {
      value : function() {
        return _level/100;
      },
      incr : function(val) {
        _level += centify(val) || 1;
      },
      decr : function(val) {
        _level -= centify(val) || 1;
        reset();
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
        handleDelta(val, level.incr);
      },
      decr : function(val) {
        handleDelta(val, level.decr);
      }
    };

    function handleDelta(val, fun) {
      var _val = val ? centify(val) : 1;
      if (_val !== 0) {
        fun(_val/centify(area));
      }      
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
    return result;

    function result() {
      return comparator(level.value(), threshold || 0);
    }
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

  function pump(level, sensor) {
    return {
      on : function() {
        return sensor();
      }
    };
  }

  return {
    level: level,
    volume: volume,
    sensor: sensorAbove(),
    sensorAbove: sensorAbove(),
    sensorBelow: sensorBelow(),
    pump: pump
  };
}());