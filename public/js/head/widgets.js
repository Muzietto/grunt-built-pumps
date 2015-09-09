var EVENTER, COMPONENTS;

if (typeof module === 'object' && typeof module.exports !== 'undefined') {
  EVENTER = require('./eventer.js').eventer;
  COMPONENTS = require('./components.js');
}

EVENTER = EVENTER || eventerFactory();
 
var WIDGETS = function(eventer, components) {
  
  function eventedLevel(start) {
    var _level = eventer(components.level(start));
    return {
      value : _level.value,
      incr : function(val) {
        var result = _level.incr(val);
        _level.trigger('level_change', val);
        return result;
      },
      decr : function(val) {
        var result = _level.decr(val);
        _level.trigger('level_change', (0 - val));
        return result;
      }
    };
  }

  // sensor threshold defines vertical position
  // sensor must be based on an eventedLevel
  function positionalProbe(sensor, $parent, left, template) {
    var widget = eventer(liquidProbe(sensor, template).init($parent, {bottom:sensor.threshold()-15, left:left}));
    widget.on('level_change', function() { widget.repaint(); });
    return widget;
  }

  // extremely unhandy (vertical position independent from sensor threshold)
  function liquidProbe(sensor, template) {
    var _$widget = $(''), _$parent, _pos;
    return result();

    function result() {
      return {
        init: function($parent, pos) {
          _$parent = $parent;
          _pos = pos;
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
        },
        domNode: function() {
          return _$widget;
        }
      };
    }
    
    function markup() { 
      return (template) ? template.process(sensor) : stdTemplate();
    }

    function $widget() {
      var style = {};
      if (_pos.top) style.top = _pos.top;
      if (_pos.left) style.left = _pos.left;
      if (_pos.bottom) style.bottom = _pos.bottom;
      if (_pos.right) style.right = _pos.right;
      style['z-index'] = 99;
      return $(markup()).css(style);
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

  function pipe(flow, incline, template) {
    var _$widget = $(''), _$parent, _pos;
    var widget = eventer(result());
    widget.on('level_change', function() { widget.repaint(); });
    return widget;

    function result() {
      return {
        init: function($parent, pos) {
          _$parent = $parent;
          _pos = pos;
          return this;
        },
        paint: function() {
          _$widget = $widget();
          _$widget.appendTo(_$parent);
          return this;
        },
        repaint: function() {
          $('.pipe', _$widget).removeClass('running')
                              .removeClass('not_running')
                              .addClass(isRunning());
          return this;
        }
      };
    }

    function markup() {
      return (template) ? template.process(pipe) : stdTemplate();
    }

    function $widget() {
      var style = {};
      if (_pos.top) style.top = _pos.top;
      if (_pos.left) style.left = _pos.left;
      if (_pos.bottom) style.bottom = _pos.bottom;
      if (_pos.right) style.right = _pos.right;
      style.width = _pos.width || 100;
      style.height = _pos.height || 50;      
      style['z-index'] = 99;
      return $(markup()).css(style);
    }

    function stdTemplate() {
      return '' +
        '<div class="widget_container absolute" id="">' +
        '  <span class="pipe">' + flow.flowRate() + '</span>' +
        '  <div class="pipe diagonal_line ' + incline + ' ' + isRunning() + '"></div>' +
        '</div>';
    }

    function isRunning() {
      return (flow.running()) ? 'running' : 'not_running';
    }
  }

  function bidirectionalPumpWidget(pump, template) {
  }

  function pumpWidget(pump, template) {
    var _$widget = $(''), _$parent, _pos, _orientation;
    var product = eventer(result());
    product.on('level_change', product.repaint);
    
    return product;
    
    function result() {
      return {
        init: function($parent, pos, orientation) {
          _$parent = $parent;
          _pos = pos;
          _orientation = orientation;
          return this;
        },
        paint: function() {
          _$widget = $widget();
          _$widget.appendTo(_$parent);
          return this;
        },
        repaint: function() {
          $('.pump_widget.circular', _$widget).css('background-color', bkgColor());
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
      var style = {};
      if (_pos.top) style.top = _pos.top;
      if (_pos.left) style.left = _pos.left;
      if (_pos.bottom) style.bottom = _pos.bottom;
      if (_pos.right) style.right = _pos.right;
      style['z-index'] = 49;
      return $(markup()).css(style);
    }
    
    function stdTemplate() {
      var bkg = 'style="background-color:' + bkgColor() + '"';
      return '' +
        '<div class="widget_container absolute" id="">' +
        '  <span class="pump_widget flow_rate">' + pump.flowRate() + '</span>' +
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
  function eventedBasin(volume, $parent, pos, template) {
    var widget = eventer(basin(volume, undefined, template).init($parent, pos.bottom||0, pos.left||0));
    widget.on('level_change', function() { widget.repaint(); });
    return widget;
  }

  // dimensions are in pixels
  function basin(volume, dimensions, template) {
    var _$widget = $(''), _$parent, _bottom, _left;
    dimensions = dimensions || {
      width : Math.round(Math.sqrt(volume.area())),
      height : 80,
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
          $('.basin.inner', _$widget).css('height', Math.ceil(volumeHeight()));
          $('.basin.outer span.basin_level', _$widget).text(Math.ceil(volumeHeight()));
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
      var volumeDims = 'width:100%;height:' + Math.ceil(volumeHeight()) + 'px;';
      return '' +
        '<div class="widget_container absolute" id="">' +
        '  <div class="basin outer" style="background-color:lightcoral;border:1px solid black;'+ basinDims +'">' +
        '    <span class="basin_level">'+ volumeHeight() +'</span>' +
        '    <div class="basin inner absolute" id="" style="background-color:white;bottom:0px;left:0px;'+ volumeDims +'"></div>' +
        '  </div>' +
        '</div>';
    }    

    // output shall always be in pixels!!!
    function volumeHeight() {
      return volume.levelValue();
    }
  }
  
  // bidir pump, volume and two sensors
  function feedbackSystem(bidirPump, volume, sensorAbove, sensorBelow, basinDimensions, $parent) {
    var pumpPos = {}; // TODO - complete me
    var basin = eventedBasin(volume, $parent, basinDimensions);
    var probeAbove = positionalProbe(sensorAbove, $parent, 25);
    var probeBelow = positionalProbe(sensorBelow, $parent, 50);
    var pumpWidget = bidirectionalPumpWidget(bidirPump).init($parent, pumpPos, 'left');
  }

  return {
    eventedLevel : eventedLevel,
    positionalProbe : positionalProbe,
    eventedBasin : eventedBasin,
    pumpWidget : pumpWidget,
    bidirectionalPumpWidget : bidirectionalPumpWidget,
    pipe : pipe,
    liquidProbe : liquidProbe,
    basin : basin,
    feedbackSystem : feedbackSystem
  };  
   
}(EVENTER, COMPONENTS);


if (typeof module === 'object' && typeof module.exports !== 'undefined') {
  module.exports = WIDGETS;
}
