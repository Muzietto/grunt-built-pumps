
var levello = COMPONENTS.level(25);
var zenzor = COMPONENTS.sensorAbove(levello, 10);
var firstProbeEver = WIDGETS.liquidProbe(zenzor).init($('#parentDiv'), {bottom:20,left:5}).paint();
var zenzor2 = COMPONENTS.sensorAbove(levello, 30);
var secondProbeEver = WIDGETS.liquidProbe(zenzor2).init($('#parentDiv'), {bottom:30,left:40}).paint();

var evlevello = WIDGETS.eventedLevel(35);
var thirdProbeEver = WIDGETS.positionalProbe(COMPONENTS.sensorAbove(evlevello, 46), $('#parentDiv'), 75).paint();
var fourthProbeEver = WIDGETS.positionalProbe(COMPONENTS.sensorBelow(evlevello, 30), $('#parentDiv'), 110).paint();

var volumello = COMPONENTS.volume(25000, evlevello);
var basinello = WIDGETS.eventedBasin(volumello, $('#parentDiv'), {left:220}).paint();

var zenzorAbofe = COMPONENTS.sensorAbove(evlevello, 37);
var zenzorBelofe = COMPONENTS.sensorBelow(evlevello, 30);

var topBasinello = WIDGETS.positionalProbe(zenzorAbofe, basinello.domNode(), 10).paint();
var bottomBasinello = WIDGETS.positionalProbe(zenzorBelofe, basinello.domNode(), 120).paint();

// removes water from basin
var pumpelloOut = WIDGETS.pumpWidget(COMPONENTS.pump(volumello, zenzorAbofe, 1500), $('#parentDiv'), {bottom:57,left:180}, 'left');
// adds water to basin                                                                                           
var pumpelloIn = WIDGETS.pumpWidget(COMPONENTS.pump(volumello, zenzorBelofe, -1500), $('#parentDiv'), {bottom:43,left:390}, 'left');

var directorId = setInterval(function() {
  pumpelloIn.onTick();
  pumpelloOut.onTick();
}, 1);
