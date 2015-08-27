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
    var widget = eventer(liquidProbe(sensor, template).init($parent, sensor.threshold() - 15, left));
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
        paint: function() {
          _$widget = $widget();
          _$widget.appendTo(_$parent);
          return this;
        },
        repaint: function() {
          $('.liquid_probe', _$widget).css('background-color', bkgColor(sensor));
          return this;
        }
      };
    }
    
    function markup() { 
      return (template) ? template.process(sensor) : stdTemplate(sensor);
    }

    function $widget() {
      return $(markup())
        .css({'bottom' : _bottom,
              'left' : _left,
              'z-index': 99});
    }
    
    function stdTemplate(sensor) {
      var bkg = 'style="background-color:' + bkgColor(sensor) + '"';
      return '' +
        '<div class="widget_container absolute" id="">' +
        '  <div class="liquid_probe circular" ' + bkg + '>' +
        '    <div class="sensor_threshold">' + sensor.threshold() + '</div>' +
        '  </div>' +
        '</div>';
    }
    
    function bkgColor(sensor) {
      return sensor() ? 'red' : 'green';
    }
  }

  // evented widget
  function eventedBasin(volume, $parent, left, template) {
    var widget = eventer(basin(volume, undefined, template).init($parent, 0, left));
    widget.on('repaint', function() { widget.repaint(); });
    return widget;
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
        paint: function() {
          _$widget = $widget();
          _$widget.appendTo(_$parent);
          return this;
        },
        repaint: function() {
          $('.basin.inner', _$widget).css('height', volumeHeight());
          return this;
        },
        domNode: function() {
          return _$widget;
        }
      };
    }

    function markup() { 
      return (template) ? template.process(volume) : stdTemplate();
    }

    function $widget() {
      return $(markup())
        .css({'bottom' : _bottom,
              'left' : _left});
    }

    // TODO - factor scale pixels/mm in!
    function stdTemplate() {
      var basinDims = 'width:'+dimensions.width+'px;height:' + dimensions.height + 'px;';
      var volumeDims = 'width:100%;height:' + volumeHeight() + 'px;';
      return '' +
        '<div class="widget_container absolute" id="">' +
        '  <div class="basin outer" style="background-color:lightcoral;border:1px solid black;'+ basinDims +'">' +
        '    <div class="basin inner absolute" id="" style="background-color:white;bottom:0px;left:0px;'+ volumeDims +'"></div>' +
        '  </div>' +
        '</div>';
    }    

    // output shall always be in pixels!!!
    function volumeHeight() {
      return volume.levelValue();
    }
  }

  return {
    eventedLevel : eventedLevel,
    positionalProbe : positionalProbe,
    eventedBasin : eventedBasin,
    liquidProbe : liquidProbe,
    basin : basin
  };  
   
}(EVENTER, COMPONENTS);


if (typeof module === 'object' && typeof module.exports !== 'undefined') {
  module.exports = WIDGETS;
}