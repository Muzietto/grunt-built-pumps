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
        _level.trigger('level_change', val);
      },
      decr : function(val) {
        _level.decr(val);
        _level.trigger('level_change', (0 - val));
      }
    };
  }

  // sensor threshold defines vertical position
  // sensor must be based on an eventedLevel
  function positionalProbe(sensor, $parent, left, template) {
    var widget = eventer(liquidProbe(sensor, template).init($parent, sensor.threshold() - 15, left));
    widget.on('level_change', function() { widget.repaint(); });
    return widget;
  }

  // extremely unhandy (vertical position independent from sensor threshold)
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
          $('.liquid_probe', _$widget).css('background-color', bkgColor());
          return this;
        }
      };
    }
    
    function markup() { 
      return (template) ? template.process(sensor) : stdTemplate();
    }

    function $widget() {
      return $(markup())
        .css({'bottom' : _bottom,
              'left' : _left,
              'z-index': 99});
    }
    
    function stdTemplate() {
      var bkg = 'style="background-color:' + bkgColor(sensor) + '"';
      return '' +
        '<div class="widget_container absolute" id="">' +
        '  <div class="liquid_probe circular" ' + bkg + '>' +
        '    <div class="sensor_threshold">' + sensor.threshold() + '</div>' +
        '  </div>' +
        '</div>';
    }
    
    function bkgColor() {
      return sensor() ? 'red' : 'green';
    }
  }

  function pumpWidget(pump, template) {
    var _$widget = $(''), _$parent, _bottom, _left, _orientation;
    var product = eventer(result());
    product.on('level_change', product.repaint);
    
    return product;
    
    function result() {
      return {
        init: function($parent, bottom, left, orientation) {
          _$parent = $parent;
          _bottom = bottom;
          _left = left;
          _orientation = orientation;
          return this;
        },
        paint: function() {
          _$widget = $widget();
          _$widget.appendTo(_$parent);
          return this;
        },
        repaint: function() {
          $('.pump_widget', _$widget).css('background-color', bkgColor());
          return this;
        },
        onTick: function() {
          pump.onTick();
          return this;
        }
      };
    }
    
    function markup() { 
      return (template) ? template.process(pump) : stdTemplate();
    }

    function $widget() {
      return $(markup())
        .css({'bottom' : _bottom,
              'left' : _left,
              'z-index': 49});
    }
    
    function stdTemplate() {
      var bkg = 'style="background-color:' + bkgColor() + '"';
      return '' +
        '<div class="widget_container absolute" id="">' +
        '  <div class="pump_widget circular absolute" ' + bkg + '>' +
        '    <div class="arrow-' + _orientation + '"></div>' +
        '  </div>' +
        '</div>';
    }
    
    function bkgColor() {
      return pump.running() ? 'green' : 'red';
    }
    
  }

  // evented widget
  function eventedBasin(volume, $parent, left, template) {
    var widget = eventer(basin(volume, undefined, template).init($parent, 0, left));
    widget.on('level_change', function() { widget.repaint(); });
    return widget;
  }

  function basin(volume, dimensions, template) {
    var _$widget = $(''), _$parent, _bottom, _left;
    dimensions = dimensions || {
      width : Math.round(Math.sqrt(volume.area())),
      height : Math.round(volume.levelValue() * 1.5),
      scale : 1 // volume_level/pixels
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

    function stdTemplate() {
      var basinDims = 'width:' + dimensions.width / dimensions.scale + 'px;' +
                      'height:' + dimensions.height / dimensions.scale + 'px;';
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
    pumpWidget : pumpWidget,
    liquidProbe : liquidProbe,
    basin : basin
  };  
   
}(EVENTER, COMPONENTS);


if (typeof module === 'object' && typeof module.exports !== 'undefined') {
  module.exports = WIDGETS;
}