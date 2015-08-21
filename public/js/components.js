
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
      }
    };
  }

  function volume(area, level) {
    return {
      value : function() {
        return decimillifyVolume()/10000;
      },
      incr : function(val) {
        var _val = val ? decimillify(val) : 1;
        var _newVolume = this.value() + _val;
        var _deltaLevel = (_newVolume - val)/centify(area);
        level.incr(_val/centify(area));
//        level.incr(_deltaLevel);
      },
      decr : function(val) {
        level.decr(centify());
      }
    };

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