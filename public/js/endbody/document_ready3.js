
var evlevel = WIDGETS.eventedLevel(5);
var volume = COMPONENTS.volume(10, evlevel);
var sensorAbove = COMPONENTS.sensorAbove(evlevel, 6);
var sensorBelow = COMPONENTS.sensorBelow(evlevel, 4);
var basinPos = { bottom : 100, left : 200 };
var basinDims = { width : 100, height : 200 };
var bidirPump = COMPONENTS.bidirectionalPump(volume, sensorAbove, sensorBelow, 100);
var systemComponents = {
  volume : volume,
  sensorAbove : sensorAbove,
  sensorBelow : sensorBelow,
  pump : bidirPump
};
var theSystem = WIDGETS.feedbackSystem(systemComponents, $('#parentDiv3'), basinPos, basinDims);



var directorId = setInterval(function() {
  bidirPump.onTick();
}, 5);
