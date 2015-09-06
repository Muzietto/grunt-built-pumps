
var evlevelUp = WIDGETS.eventedLevel(55);
var sensorUp = COMPONENTS.sensorBelow(evlevelUp, 30);
var volumeUp = COMPONENTS.volume(25000, evlevelUp);
var evBasinUp = WIDGETS.eventedBasin(volumeUp, $('#parentDiv2'), {left:60,bottom:100}).paint();
var probeUp = WIDGETS.positionalProbe(sensorUp, evBasinUp.domNode(), 10).paint();

var evlevelDown = WIDGETS.eventedLevel(5);
var sensorDown = COMPONENTS.sensorAbove(evlevelDown, 37);
var volumeDown = COMPONENTS.volume(25000, evlevelDown);
var evBasinDown = WIDGETS.eventedBasin(volumeDown, $('#parentDiv2'), {left:220,bottom:0}).paint();
var probeDown = WIDGETS.positionalProbe(sensorDown, evBasinDown.domNode(), 120).paint();

var flowConn = COMPONENTS.flow(volumeUp, volumeDown, 4000);

// adds water to upper basin
var pumpIn = WIDGETS.pumpWidget(COMPONENTS.pump(volumeUp, sensorUp, -1500)).init($('#parentDiv2'), {bottom:150,left:20}, 'right').paint();
// connects the two basins
var flowConnPipe = WIDGETS.pipe(flowConn, 'negative').init($('#parentDiv2'), {bottom:5,left:180,width:100,height:110}).paint();
// removes water from lower basin
var pumpOut = WIDGETS.pumpWidget(COMPONENTS.pump(volumeDown, sensorDown, 100)).init($('#parentDiv2'), {bottom:43,left:390}, 'right').paint();

var directorId = setInterval(function() {
  pumpIn.onTick();
  pumpOut.onTick();
  flowConn.onTick();
}, 5);
