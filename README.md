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

- use components api to increase/decrease levels. Some actions are fitted with buttons.

#### sample_01.html
Type `evlevello.incr(20)` or `evlevello.decr(20)` in the console and watch the pumps restore an acceptable water level.

![sample_01](/doc/img/sample_01.jpg)

The page contains also some initial experiments with HTML5 drag'n'drop functionalities. One day these pumps and sensors 
will be all composed dragging and dropping their widgets onto the canvas.

***

#### sample_02.html
Use the given buttons to swith on/off the two pipes in the system. Sensors alert pumps, which do their job. Water flows.

![sample_02](/doc/img/sample_02.jpg)

***

#### sample_03.html
A chain of feedback systems, where bidirectional pumps maintain water levels between the desired values.

![sample_03](/doc/img/sample_03.jpg)

***


## Grunt in development
Run `grunt watch:lint_client` for automated linting and unit testing

## Grunt in production
Take as example task `grunt build:release`

----------
[1] http://www.carlopescio.com/2012/03/life-without-controller-case-1.html
