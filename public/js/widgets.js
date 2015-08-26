var EVENTER;

if (typeof module === 'object' && typeof module.exports !== 'undefined') {
  EVENTER = require('./eventer.js');
}

EVENTER = EVENTER || eventerFactory();

var WIDGETS = function(eventer) {

  function liquidProbe(sensor, template) {
    var _$widget = $(''), _$parent, _top, _left;
    return result();
    
    function result() {
      return {
        init: function($parent, top, left) {
          _$parent = $parent;
          _top = top;
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
        .css('top', _top)
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

  function basin(volume) {
    
  }


  return {
    liquidProbe : liquidProbe,
    basin : basin
  };  
   
}(EVENTER);


if (typeof module === 'object' && typeof module.exports !== 'undefined') {
  module.exports = WIDGETS;
}