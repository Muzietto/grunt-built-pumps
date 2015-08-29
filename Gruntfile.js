'use strict';

module.exports = function(grunt){
  grunt.initConfig({
    // used by the changelog task
    pkg: grunt.file.readJSON('package.json'),

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
      js: 'build/js'
    },

    jshint: {
      client: ['public/js/**/*.js', '!public/js/utils/**/*.js'],
      server: ['server/js/**/*.js'],
      support: ['public/js/**/*.js']
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
        editor: "notepad++"
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

  grunt.registerTask('notes', ['bump-only', 'conventionalChangelog', 'bump-commit']);
  grunt.registerTask('build:debug', 'minimal processing', ['jshint', 'simplemocha:all', 'clean:js', 'concat:js']);
  grunt.registerTask('build:release', 'Concatenate and minify js files', ['jshint', 'simplemocha:all', 'clean:js', 'concat:js', 'uglify:bundle', 'bump-remote']);

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