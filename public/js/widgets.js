var EVENTER, COMPONENTS;

if (typeof module === 'object' && typeof module.exports !== 'undefined') {
  EVENTER = require('./eventer.js');
  COMPONENTS = require('./components.js');
}

EVENTER = EVENTER || eventerFactory();
 
var WIDGETS = function(eventer, components) {
  
  function eventedLevel(start) {
    var _level = eventer(components.level(start));
    return {
      value : _level.value,
      incr : function(val) {
        _level.incr(val);
        _level.trigger('changed_level', val);
        _level.trigger('repaint');
      },
      decr : function(val) {
        _level.decr(val);
        _level.trigger('changed_level', (0 - val));
        _level.trigger('repaint');
      }
    };
  }

  // sensor must be based on an eventedLevel  
  function positionalProbe(sensor, $parent, left, template) {
    var widget = eventer(liquidProbe(sensor, template).init($parent, sensor.threshold(), left));
    widget.on('repaint', function() { widget.repaint(); });
    return widget;
  }

  function liquidProbe(sensor, template) {
    var _$widget = $(''), _$parent, _bottom, _left;
    return result();
    
    function result() {
      return {
        init: function($parent, bottom, left) {
          _$parent = $parent;
          _bottom = bottom;
          _left = left;
          return this;
        },
        repaint: function() {
          _$widget = undefined;
          _$widget = $widget();
          _$widget.appendTo(_$parent);
          return this;
        }
      };
    }
    
    function markup() { 
      return (template) ? template.process(sensor) : stdTemplate(sensor);
    }

    function $widget() {
      return $(markup())
        .css('bottom', _bottom)
        .css('left', _left);
    }
    
    function stdTemplate(sensor) {
      var bkg = 'style="background-color:' + (sensor() ? 'red' : 'green') + '"';
      return '' +
        '<div class="liquid_probe absolute circular" id=""' + bkg + '>' +
        '<div>' + sensor.threshold() + '</div>' +
        '</div>';
    }
  }

  function basin(volume, dimensions, template) {
    var _$widget = $(''), _$parent, _bottom, _left;
    dimensions = dimensions || {
      width : Math.round(Math.sqrt(volume.area())),
      height : Math.round(volume.levelValue() * 1.5)
    };
    return result();
    
    function result() {
      return {
        init: function($parent, bottom, left) {
          _$parent = $parent;
          _bottom = bottom;
          _left = left;
          return this;
        },
        repaint: function() {
          _$widget = undefined;
          _$widget = $widget();
          _$widget.appendTo(_$parent);
          return this;
        },
        domNode: function() {
          return _$widget;
        }
      };
    }
    
    function markup() { 
      return (template) ? template.process(volume) : stdTemplate(volume);
    }

    function $widget() {
      return $(markup())
        .css('bottom', _bottom)
        .css('left', _left);
    }
    
    // TODO - factor in scale pixels/mm
    function stdTemplate(volume) {
      var basinDims = 'width:'+dimensions.width+'px;height:' + dimensions.height + 'px;';
      var volumeDims = 'width:100%;height:' + volume.levelValue() + 'px;';
      return '' +
        '<div class="basin outer absolute" id="" style="border:1px solid black;'+ basinDims +'">' +
        '<div class="inner absolute" id="" style="background-color:white;bottom:0px;left:0px;'+ volumeDims +'"></div>' +
        '</div>';
    }    
  }

  return {
    eventedLevel : eventedLevel,
    positionalProbe : positionalProbe,
    liquidProbe : liquidProbe,
    basin : basin
  };  
   
}(EVENTER, COMPONENTS);


if (typeof module === 'object' && typeof module.exports !== 'undefined') {
  module.exports = WIDGETS;
}