
var COMPONENTS = require('./components.js');

var WIDGETS = function(components) {

  function basin(volume) {
    
  }


  return {
    basin : basin
  };  
  
}(COMPONENTS);


if (typeof module === 'object' && typeof module.exports !== 'undefined') {
  module.exports = WIDGETS;
}