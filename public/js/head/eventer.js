
function eventerFactory() {
  var eventedObjects = {};

  var result = function(object) {
    object = object || {};
    if (object.on) { return object; }
 
    object.on = function (event, callback) {
      if (!object._events) { object._events = {}; }
      if (!object._events[event]) { object._events[event] = []; }
      object._events[event].push(callback);

      if (!eventedObjects[event]) { eventedObjects[event] = []; }
      if (eventedObjects[event].indexOf(object) === -1) {
        eventedObjects[event].push(object);
      }
      return object;
    }; 
    object.trigger = staticTrigger;

    return object;
  };
  result.clear = function() {
    eventedObjects = [];
  }; 
  result.trigger = staticTrigger;
  return result;

  function staticTrigger(event, payload) {
    if (eventedObjects[event]) {
      eventedObjects[event].forEach(function(obj) {
        if (obj._events && obj._events[event]) {
          obj._events[event].forEach(function(callback) {
            callback(payload); 
          });
        }
      });
    }
  }
}

if (typeof module === 'object' && typeof module.exports !== 'undefined') {
  module.exports = {
    eventer : eventerFactory()
  };
} else {
  var EVENTER = eventerFactory();
}
