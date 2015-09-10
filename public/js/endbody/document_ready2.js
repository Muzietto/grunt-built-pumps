
var evlevelUp = WIDGETS.eventedLevel(55);
var sensorUp = COMPONENTS.sensorBelow(evlevelUp, 30);
var volumeUp = COMPONENTS.volume(25000, evlevelUp);
var evBasinUp = WIDGETS.eventedBasin(volumeUp, $('#parentDiv2'), {left:60,bottom:150}).paint();
var probeUp = WIDGETS.positionalProbe(sensorUp, evBasinUp.domNode(), 10).paint();

var evlevelDown = WIDGETS.eventedLevel(5);
var sensorDown = COMPONENTS.sensorAbove(evlevelDown, 37);
var volumeDown = COMPONENTS.volume(25000, evlevelDown);
var evBasinDown = WIDGETS.eventedBasin(volumeDown, $('#parentDiv2'), {left:220,bottom:0}).paint();
var probeDown = WIDGETS.positionalProbe(sensorDown, evBasinDown.domNode(), 120).paint();

var volumeFinal = COMPONENTS.volume(25000, WIDGETS.eventedLevel(2));
var evBasinFinal = WIDGETS.eventedBasin(volumeFinal, $('#parentDiv2'), {left:400,bottom:80}).paint();

var flowConn = COMPONENTS.flow(volumeUp, volumeDown, 4000);

// adds water to upper basin
var pumpIn = WIDGETS.pumpWidget(COMPONENTS.pump(volumeUp, sensorUp, -1500), $('#parentDiv2'), {bottom:220,left:20}, 'right');
// connects the two basins
var flowConnPipe = WIDGETS.pipe(flowConn, 'negative').init($('#parentDiv2'), {bottom:5,left:180,width:100,height:170}).paint();
// removes water from lower basin
var pumpOut = WIDGETS.pumpWidget(COMPONENTS.pump(volumeDown, sensorDown, 400, volumeFinal), $('#parentDiv2'), {bottom:43,left:390}, 'right');

var evlevel0 = WIDGETS.eventedLevel(1);
var volume0 = COMPONENTS.volume(30000, evlevel0);  // controlled by the bidir pump
var evBasin0 = WIDGETS.eventedBasin(volume0, $('#parentDiv2'), {bottom:20,left:600}).paint();
var sensorAbove0 = COMPONENTS.sensorAbove(evlevel0, 70);
var probeAbove0 = WIDGETS.positionalProbe(sensorAbove0, evBasin0.domNode(), 10).paint();
var sensorBelow0 = COMPONENTS.sensorBelow(evlevel0, 20);
var probeBelow0 = WIDGETS.positionalProbe(sensorBelow0, evBasin0.domNode(), 120).paint();
var bidirPump0 = WIDGETS.bidirectionalPumpWidget(COMPONENTS.bidirectionalPump(volume0, sensorAbove0, sensorBelow0, 600, volumeFinal, volumeUp), $('#parentDiv2'), {bottom:60,left:560});

var flow0 = COMPONENTS.flow(volume0, null, 200);
var flowPipe0 = WIDGETS.pipe(flow0, 'negative').init($('#parentDiv2'), {bottom:1,left:750,width:100,height:30}).paint();
$('#offButton').click(flowConn.switchOff);
$('#onButton').click(flowConn.switchOn);
$('#offButton0').click(flow0.switchOff);
$('#onButton0').click(flow0.switchOn);

var directorId = setInterval(function() {
  pumpIn.onTick();
  pumpOut.onTick();
  flowConn.onTick();
  bidirPump0.onTick();
  flow0.onTick();
}, 5);
