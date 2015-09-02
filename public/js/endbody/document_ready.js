          var levello = COMPONENTS.level(25);
          var zenzor = COMPONENTS.sensorAbove(levello, 20);
          var firstProbeEver = WIDGETS.liquidProbe(zenzor).init($('#parentDiv'),20,80).paint();
          var zenzor2 = COMPONENTS.sensorAbove(levello, 30);
          var secondProbeEver = WIDGETS.liquidProbe(zenzor2).init($('#parentDiv'),30,180).paint();
          var evlevello = WIDGETS.eventedLevel(35);
          var thirdProbeEver = WIDGETS.positionalProbe(COMPONENTS.sensorAbove(evlevello, 46), $('#parentDiv'), 280).paint();
          var fourthProbeEver = WIDGETS.positionalProbe(COMPONENTS.sensorBelow(evlevello, 30), $('#parentDiv'), 380).paint();
          
          var volumello = COMPONENTS.volume(25000, evlevello);
          var basinello = WIDGETS.eventedBasin(volumello, $('#parentDiv'), 480).paint();
          var topBasinello = WIDGETS.positionalProbe(COMPONENTS.sensorAbove(evlevello, 37), basinello.domNode(), 10).paint();
          var bottomBasinello = WIDGETS.positionalProbe(COMPONENTS.sensorBelow(evlevello, 30), basinello.domNode(), 50).paint();
