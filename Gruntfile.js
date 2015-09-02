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
              releases_to_keep: '3',
              release_subdir: ''
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
          'build/temp/bundle_head.js': ['public/js/utils/**/*.js', 'public/js/head/**/*.js'],
          'build/temp/bundle_endbody.js': 'public/js/endbody/**/*.js'
        }
      },
      css: {
        files: {
          'build/temp/bundle.css': 'public/css/**/*.css'
        }
      }
    },

    uglify: {
      bundle: {
        files: {
          'build/temp/head.min.js': 'build/temp/bundle_head.js',
          'build/temp/endbody.min.js': 'build/temp/bundle_endbody.js'
        }
      }
    },

    copy: {
      main: {
        files: [
          // includes files within path and its sub-directories
          {expand: true, src: ['app.js'], dest: 'build/'},
          {expand: true, src: ['package.json'], dest: 'build/'},
          {expand: true, src: ['public/favicon.ico'], dest: 'build/'},
          //{expand: true, src: ['public/html/**'], dest: 'build/'},
          {expand: true, src: ['public/img/**'], dest: 'build/'},
          {expand: true, src: ['server/**'], dest: 'build/'}
        ],
      },
    },
    
    processhtml: {
      options: {
      },
      main: {
        files: {
          'build/public/html/sample_01.html': ['public/html/sample_01.html']
        }
      }
    },

    clean: {
      build: ['build'],
      build_temp: ['build/temp']
    },

    jshint: {
      client: ['public/js/**/*.js', '!public/js/utils/**/*.js' ],
      server: ['server/**/*.js']
    },

    // --> run 'grunt watch:lint_client'
    watch: {
      lint_client: {
        tasks: ['jshint:client', 'simplemocha:all'],
        files: ['public/js/**/*.js', 'spec/js/**/*.js']
      },
      lint_server: {
        tasks: ['jshint:server'],
        files: ['server/**/*.js']
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
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-ssh-deploy');
  grunt.loadNpmTasks('grunt-processhtml');

  grunt.registerTask('notes', ['bump-only', 'conventionalChangelog', 'bump-commit']);
  grunt.registerTask('build:debug', 'minimal processing', ['jshint', 'simplemocha:all']);
  grunt.registerTask('build:release',
                     'Concatenate and minify js files',
                     [
                      'jshint',
                      'simplemocha:all',
                      'clean:build',
                      'copy:main',
                      'concat:css',
                      'concat:js',
                      'uglify:bundle',
                      'processhtml:main',
                      'clean:build_temp',
                      'bump',
                      'ssh_deploy:production'
                      ]);

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