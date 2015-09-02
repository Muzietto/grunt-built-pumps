# grunt-built-pumps
Experiments with grunt while managing pumps and sensors (see [1])

When the server is on, you may admire this app at http://node.faustinelli.org/grunt-built-pumps/

The build process showcases the following grunt plugins:

- watch, jshint, simplemocha --> to allow TDD while developing

- concat, uglify, processhtml --> to produce static, lean & mean HTML pages

- bump, conventionalChangelog --> to version and document each release

- ssh_deploy --> to deploy remotely


## Local demo:

- clone project

- doubleclick on files in public/html

- use components api to increase/decrease levels


## development
Run `grunt watch:lint_client` for automated linting and unit testing

## production
Take as example task `grunt build:release`

----------
[1] http://www.carlopescio.com/2012/03/life-without-controller-case-1.html
