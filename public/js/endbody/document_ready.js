
var levello = COMPONENTS.level(25);
var zenzor = COMPONENTS.sensorAbove(levello, 10);
var firstProbeEver = WIDGETS.liquidProbe(zenzor).init($('#parentDiv'),20,10).paint();
var zenzor2 = COMPONENTS.sensorAbove(levello, 30);
var secondProbeEver = WIDGETS.liquidProbe(zenzor2).init($('#parentDiv'),30,50).paint();

var evlevello = WIDGETS.eventedLevel(35);
var thirdProbeEver = WIDGETS.positionalProbe(COMPONENTS.sensorAbove(evlevello, 46), $('#parentDiv'), 90).paint();
var fourthProbeEver = WIDGETS.positionalProbe(COMPONENTS.sensorBelow(evlevello, 30), $('#parentDiv'), 130).paint();

var volumello = COMPONENTS.volume(25000, evlevello);
var basinello = WIDGETS.eventedBasin(volumello, $('#parentDiv'), 170).paint();

var zenzorAbofe = COMPONENTS.sensorAbove(evlevello, 37);
var zenzorBelofe = COMPONENTS.sensorBelow(evlevello, 30);

var topBasinello = WIDGETS.positionalProbe(zenzorAbofe, basinello.domNode(), 10).paint();
var bottomBasinello = WIDGETS.positionalProbe(zenzorBelofe, basinello.domNode(), 50).paint();

// removes water from basin
var pumpelloOut = WIDGETS.pumpWidget(COMPONENTS.pump(volumello, zenzorAbofe, 1)).init($('#parentDiv'), 100, 350, 'right').paint();
// adds water to basin
var pumpelloIn = WIDGETS.pumpWidget(COMPONENTS.pump(volumello, zenzorBelofe, -1)).init($('#parentDiv'), 50, 350, 'left').paint();


