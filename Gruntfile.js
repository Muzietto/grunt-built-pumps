'use strict';

module.exports = function(grunt){
  grunt.initConfig({
    // used by the changelog task
    pkg: grunt.file.readJSON('package.json'),
    secret: grunt.file.readJSON('../server_tedesco.json'),

    environments: {
      options: {
        local_path: 'build',
        current_symlink: 'current',
        deploy_path: '/var/www/vhosts/faustinelli.org/node.faustinelli.org/grunt-built-pumps'
      },
  /*    staging: {
          options: {
              host: '<%= secret.staging.host %>',
              username: '<%= secret.staging.username %>',
              password: '<%= secret.staging.password %>',
              port: '<%= secret.staging.port %>',
              debug: true,
              releases_to_keep: '3'
          }
      },*/
      production: {
          options: {
              host: '<%= secret.production.host %>',
              username: '<%= secret.production.username %>',
              password: '<%= secret.production.password %>',
              port: '<%= secret.production.port %>',
              releases_to_keep: '5',
              release_subdir: 'node.faustinelli.org/grunt-built-pumps'
          }
      }
    },

    // http://fairwaytech.com/2014/01/understanding-grunt-part-2-automated-testing-with-mocha/
    simplemocha: {
      options: {
        globals: ['expect'],
        timeout: 1000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'tap'
      },
      all: { src: 'spec/**/*.js' }
    },
    concat: {
      js: {
        files: {
          'build/js/bundle.js': 'public/js/**/*.js'
        }
      },
      css: {
        files: {
          'build/css/bundle.css': 'public/css/**/*.css'
        }
      }
    },

    uglify: {
      bundle: {
        files: {
          'build/js/all.min.js': 'build/js/bundle.js'
        }
      }
    },

    clean: {
      build: ['build']
    },

    jshint: {
      client: ['public/js/**/*.js', '!public/js/utils/**/*.js' ],
      server: ['server/js/**/*.js']
    },

    // --> run 'grunt watch:lint_client'
    watch: {
      lint_client: {
        tasks: ['jshint:client', 'simplemocha:all'],
        files: ['public/js/**/*.js', 'spec/js/**/*.js']
      },
      lint_server: {
        tasks: ['jshint:server'],
        files: ['srv/**/*.js']
      }
    },

    bump: {
      options: {
        updateConfigs: ['pkg'],
        commitFiles: ['package.json', 'CHANGELOG.md'],
        commit: true,
        createTag: true,
        push: true,
        pushTo: "origin"
      }
    },
    
    conventionalChangelog: {
      options: {
        editor: "notepad"
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-ssh-deploy');

  grunt.registerTask('notes', ['bump-only', 'conventionalChangelog', 'bump-commit']);
  grunt.registerTask('build:debug', 'minimal processing', ['jshint', 'simplemocha:all', 'clean:build']);
  grunt.registerTask('build:release', 'Concatenate and minify js files', ['jshint', 'simplemocha:all', 'clean:build', 'concat:js', 'uglify:bundle',/* 'bump',*/ 'ssh_deploy:production']);

  grunt.registerTask('timestamp', function() {
    var options = this.options({
      file: '.timestamp'
    });
    var timestamp = new Date();
    var contents = timestamp.toString();
    grunt.file.write(options.file, contents);
  });
  // Add a default task. This is optional, of course :) 
  grunt.registerTask('default', 'simplemocha:all');
};