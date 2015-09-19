var basinsBottom = 70;
var basinsLeftmost = 4;

var evlevel0 = WIDGETS.eventedLevel(195);
var volume0 = COMPONENTS.volume(10000, evlevel0);
var sensorAbove0 = COMPONENTS.sensorAbove(evlevel0, 60);
var sensorBelow0 = COMPONENTS.sensorBelow(evlevel0, 40);
var basinPos0 = { bottom : basinsBottom, left : basinsLeftmost };
var basinDims0 = { scale : 1, height : 200 };

//////////////////////////////////////
var evlevel1 = WIDGETS.eventedLevel(95);
var volume1 = COMPONENTS.volume(10000, evlevel1);
var sensorAbove1 = COMPONENTS.sensorAbove(evlevel1, 60);
var sensorBelow1 = COMPONENTS.sensorBelow(evlevel1, 40);
var basinPos1 = { bottom : basinsBottom, left : basinsLeftmost + 150 };
var basinDims1 = { scale : 1, height : 150 };

//////////////////////////////////////
var evlevel2 = WIDGETS.eventedLevel(25);
var volume2 = COMPONENTS.volume(10000, evlevel2);
var sensorAbove2 = COMPONENTS.sensorAbove(evlevel2, 60);
var sensorBelow2 = COMPONENTS.sensorBelow(evlevel2, 40);
var basinPos2 = { bottom : basinsBottom, left : basinsLeftmost + 300 };
var basinDims2 = { scale : 1, height : 100 };

//////////////////////////////////////
var evlevel3 = WIDGETS.eventedLevel(75);
var volume3 = COMPONENTS.volume(10000, evlevel3);
var sensorAbove3 = COMPONENTS.sensorAbove(evlevel3, 60);
var sensorBelow3 = COMPONENTS.sensorBelow(evlevel3, 40);
var basinPos3 = { bottom : basinsBottom, left : basinsLeftmost + 450 };
var basinDims3 = { scale : 1, height : 100 };

//////////////////////////////////////
var evlevel4 = WIDGETS.eventedLevel(20);
var volume4 = COMPONENTS.volume(10000, evlevel4);
var sensorAbove4 = COMPONENTS.sensorAbove(evlevel4, 60);
var sensorBelow4 = COMPONENTS.sensorBelow(evlevel4, 40);
var basinPos4 = { bottom : basinsBottom, left : basinsLeftmost + 600 };
var basinDims4 = { scale : 1, height : 100 };

//////////////////////////////////////
var evlevel5 = WIDGETS.eventedLevel(55);
var volume5 = COMPONENTS.volume(10000, evlevel5);
var sensorAbove5 = COMPONENTS.sensorAbove(evlevel5, 60);
var sensorBelow5 = COMPONENTS.sensorBelow(evlevel5, 40);
var basinPos5 = { bottom : basinsBottom, left : basinsLeftmost + 750 };
var basinDims5 = { scale : 1, height : 100 };

////////////////////////////////////////
var bidirPump0 = COMPONENTS.bidirectionalPump(volume0, sensorAbove0, sensorBelow0, 1200, undefined, volume1);
var systemComponents0 = {
  volume : volume0,
  sensorAbove : sensorAbove0,
  sensorBelow : sensorBelow0,
  pump : bidirPump0
};
var theSystem0 = WIDGETS.feedbackSystem(systemComponents0, $('#parentDiv3'), basinPos0, basinDims0);

var bidirPump1 = COMPONENTS.bidirectionalPump(volume1, sensorAbove1, sensorBelow1, 90, volume0, volume2);
var systemComponents1 = {
  volume : volume1,
  sensorAbove : sensorAbove1,
  sensorBelow : sensorBelow1,
  pump : bidirPump1
};
var theSystem1 = WIDGETS.feedbackSystem(systemComponents1, $('#parentDiv3'), basinPos1, basinDims1);

var bidirPump2 = COMPONENTS.bidirectionalPump(volume2, sensorAbove2, sensorBelow2, 100, volume1, volume3);
var systemComponents2 = {
  volume : volume2,
  sensorAbove : sensorAbove2,
  sensorBelow : sensorBelow2,
  pump : bidirPump2
};
var theSystem2 = WIDGETS.feedbackSystem(systemComponents2, $('#parentDiv3'), basinPos2, basinDims2);

var bidirPump3 = COMPONENTS.bidirectionalPump(volume3, sensorAbove3, sensorBelow3, 200, volume2, volume4);
var systemComponents3 = {
  volume : volume3,
  sensorAbove : sensorAbove3,
  sensorBelow : sensorBelow3,
  pump : bidirPump3
};
var theSystem3 = WIDGETS.feedbackSystem(systemComponents3, $('#parentDiv3'), basinPos3, basinDims3);

var bidirPump4 = COMPONENTS.bidirectionalPump(volume4, sensorAbove4, sensorBelow4, 500, volume3, volume5);
var systemComponents4 = {
  volume : volume4,
  sensorAbove : sensorAbove4,
  sensorBelow : sensorBelow4,
  pump : bidirPump4
};
var theSystem4 = WIDGETS.feedbackSystem(systemComponents4, $('#parentDiv3'), basinPos4, basinDims4);

var bidirPump5 = COMPONENTS.bidirectionalPump(volume5, sensorAbove5, sensorBelow5, 10, volume4, null);
var systemComponents5 = {
  volume : volume5,
  sensorAbove : sensorAbove5,
  sensorBelow : sensorBelow5,
  pump : bidirPump5
};
var theSystem5 = WIDGETS.feedbackSystem(systemComponents5, $('#parentDiv3'), basinPos5, basinDims5);


var directorId = setInterval(function() {
  bidirPump0.onTick();
  bidirPump1.onTick();
  bidirPump2.onTick();
  bidirPump3.onTick();
  bidirPump4.onTick();
  bidirPump5.onTick();
}, 5);

var xxxcccc = 0;
var signal = EVENTER({}).on('level_change',function(){
  //console.log('level_change-->' + xxxcccc++);
});