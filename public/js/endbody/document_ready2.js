
var evlevelUp = WIDGETS.eventedLevel(35);
var sensorUp = COMPONENTS.sensorBelow(evlevelUp, 30);
var volumeUp = COMPONENTS.volume(25000, evlevelUp);
var evBasinUp = WIDGETS.eventedBasin(volumeUp, $('#parentDiv2'), {left:60,bottom:100}).paint();
var probeUp = WIDGETS.positionalProbe(sensorUp, evBasinUp.domNode(), 10).paint();

var evlevelDown = WIDGETS.eventedLevel(35);
var sensorDown = COMPONENTS.sensorAbove(evlevelDown, 37);
var volumeDown = COMPONENTS.volume(25000, evlevelDown);
var evBasinDown = WIDGETS.eventedBasin(volumeDown, $('#parentDiv2'), {left:220,bottom:0}).paint();
var probeDown = WIDGETS.positionalProbe(sensorDown, evBasinDown.domNode(), 120).paint();

// adds water to upper basin
var pumpIn = WIDGETS.pumpWidget(COMPONENTS.pump(volumeUp, sensorUp, -1500)).init($('#parentDiv2'), 43, 390, 'right').paint();
// removes water from lower basin
var pumpOut = WIDGETS.pumpWidget(COMPONENTS.pump(volumeDown, sensorDown, 1500)).init($('#parentDiv2'), 57, 180, 'left').paint();

var directorId = setInterval(function() {
  pumpelloIn.onTick();
  pumpelloOut.onTick();
}, 1);
