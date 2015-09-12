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

  // sensor threshold defines vertical position
  // sensor must be based on an eventedLevel
  function positionalProbe(sensor, $parent, left, template) {
    var widget = eventer(liquidProbe(sensor, template).init($parent, {bottom:sensor.threshold()-15, left:left}));
    widget.on('level_change', function() { widget.repaint(); });
    return widget;
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
        '  <span class="pipe_label">' + flow.flowRate() + '</span>' +
        '  <div class="pipe diagonal_line ' + incline + ' ' + isRunning() + '"></div>' +
        '</div>';
    }

    function isRunning() {
      return (flow.running() !== 0) ? 'running' : 'not_running';
    }
  }

  // dimensions are in pixels. width is ignored
  function basin(volume, dimensions, template) {
    var _$widget = $(''), _$parent, _bottom, _left,
    _dimensions = {
      width : Math.round(Math.sqrt(volume.area())),
      height : dimensions && dimensions.height || 80,
      scale : dimensions && dimensions.scale || 1 // volume_level/pixels
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
      var basinDims = 'width:' + Math.ceil(_dimensions.width / _dimensions.scale) + 'px;' +
                      'height:' + Math.ceil(_dimensions.height / _dimensions.scale) + 'px;';
      var volumeDims = 'width:100%;height:' + Math.ceil(volumeHeight() / _dimensions.scale) + 'px;';
      return '' +
        '<div class="widget_container absolute" id="">' +
        '  <div class="basin outer" style="background-color:lightcoral;border:1px solid black;'+ basinDims +'">' +
        '    <span class="basin_level">'+ volumeHeight() +'</span>' +
        '    <div class="basin inner absolute" id="" style="background-color:white;bottom:0px;left:0px;'+ volumeDims +'"></div>' +
        '  </div>' +
        '</div>';
    }

    // output is in mm, not in pixels!!
    function volumeHeight() {
      return volume.levelValue();
    }
  }

  // evented widget
  function eventedBasin(volume, $parent, pos, dims, template) {
    var widget = eventer(basin(volume, dims, template).init($parent, pos.bottom||0, pos.left||0));
    widget.on('level_change', function() { widget.repaint(); });
    return widget;
  }

  function pumpWidget(pump, $parent, pos, orientation, template) {
    var _orientation = (typeof orientation === 'function') ? orientation : function() { return orientation; };
    var _$widget = $widget();
    _$widget.appendTo($parent);
    var product = eventer(result());
    product.on('level_change', product.repaint);
    return product;

    function result() {
      return {
        repaint: function() {
          $('.pump', _$widget).removeClass('running')
                              .removeClass('not_running')
                              .addClass(isRunning());
          $('.pump .orientation', _$widget).removeClass('arrow-up')
                                           .removeClass('arrow-left')
                                           .removeClass('arrow-right')
                                           .removeClass('arrow-down')
                                           .addClass('arrow-' + _orientation());
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
      if (pos.top) style.top = pos.top;
      if (pos.left) style.left = pos.left;
      if (pos.bottom) style.bottom = pos.bottom;
      if (pos.right) style.right = pos.right;
      style['z-index'] = 49;
      return $(markup()).css(style);
    }

    function stdTemplate() {
      return '' +
        '<div class="widget_container absolute" id="">' +
        '  <span class="pump_flow_rate">' + pump.flowRate() + '</span>' +
        '  <div class="pump circular absolute ' + isRunning() + '">' +
        '    <div class="orientation arrow-' + _orientation() + '"></div>' +
        '  </div>' +
        '</div>';
    }

    function isRunning() {
      return (pump.running() !== 0) ? 'running' : 'not_running';
    }
  }

  function bidirectionalPumpWidget(pump, $parent, pos, template) {
    var result = pumpWidget(pump, $parent, pos, orientation);
    return result;

    function orientation() {
      var result = 'up';
      if (pump.running() === 1) result = 'left'; // extracting
      if (pump.running() === -1) result = 'right'; // filling
      return result;
    }
  }

  function feedbackSystem(systemComponents, $parent, basinPos, basinDims) {
    var pumpPos = { bottom: basinPos.bottom + 40, left: basinPos.left - 40};
    var basin = eventedBasin(systemComponents.volume, $parent, basinPos, basinDims).paint();
    var probeAbove = positionalProbe(systemComponents.sensorAbove, basin.domNode(), 10).paint();
    var probeBelow = positionalProbe(systemComponents.sensorBelow, basin.domNode(), 45).paint();
    var pumpWidget = bidirectionalPumpWidget(systemComponents.pump, $parent, pumpPos);
    return basin;
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
