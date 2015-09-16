# grunt-built-pumps
Experiments with grunt while managing pumps and sensors (see [1])

All events (involving pure JS objects and no DOM-nodes) are handled by [Kolosso-Eventer](https://github.com/Muzietto/kolosso-eventer)

When the remote node.js server is on, you may admire this app at http://node.faustinelli.org/grunt-built-pumps/

The build process showcases the following grunt plugins:

- watch, jshint, simplemocha --> to allow TDD while developing

- concat, uglify, processhtml --> to produce static, lean & mean HTML pages

- bump, conventionalChangelog --> to version and document each release

- ssh_deploy --> to deploy remotely


## Local demo:

- clone project

- doubleclick on files in public/html

- use components api to increase/decrease levels

#### sample_01.html
Type `evlevello.incr(20)` or `evlevello.decr(20)` in the console and watch the pumps restore an acceptable water level.

The page contains also some initial experiments with HTML5 drag'n'drop functionalities. One day these pumps and sensors 
will be all composed dragging and dropping their widgets onto the canvas.

#### sample_02.html
Click the `flowConn.switchOff()` button and watch the pump on the left restore automatically an acceptable water level (if the left sensor says it's necessary).

Click the `flowConn.swithOn()` button and the pipe will start again draining water from the left basin.

The pump on the right starts if there is too much water in the central basin and carries it in the rightmost one

#### sample_03.html
Showcase of bidirectional pumps. Bidir pumps are an abstraction that contains two (unidirectional) pumps with the same flow rate and swapping each other's source and sink.

## Grunt in development
Run `grunt watch:lint_client` for automated linting and unit testing

## Grunt in production
Take as example task `grunt build:release`

----------
[1] http://www.carlopescio.com/2012/03/life-without-controller-case-1.html
