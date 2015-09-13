
function eventerFactory() {
  var eventedObjects = {};

  var factory = function(object, publishers) {
    object = object || {};
    if (object.on) { return object; }
    var _publishers = (publishers && !(publishers instanceof Array)) ? [publishers] : publishers;

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
    object.onLocal = function(event, callback) {
      if (_publishers) {
        _publishers.forEach(function(pub) {
          object.on(event + '_' + pub.uuid, callback);
        });
      }
      return object;
    };
    object.uuid = uuidGenerator();
    object.trigger = staticTrigger(object.uuid);

    return object;
  };
  factory.clear = function() {
    eventedObjects = [];
  };
  factory.trigger = staticTrigger('global');
  return factory;

  function uuidGenerator() { // http://stackoverflow.com/questions/105034
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  function staticTrigger(uuid) {
    return function(event, payload) {
      _trigger(event);
      if (uuid) {
        _trigger(event + '_' + uuid);
      }

      function _trigger(ev) {
        if (eventedObjects[ev]) {
          eventedObjects[ev].forEach(function (obj) {
            if (obj._events && obj._events[ev]) {
              obj._events[ev].forEach(function (callback) {
                callback(payload);
              });
            }
          });
        }
      }
    };
  }
}

if (typeof module === 'object' && typeof module.exports !== 'undefined') {
  module.exports = {
    eventer : eventerFactory()
  };
} else {
  var EVENTER = eventerFactory();
}
