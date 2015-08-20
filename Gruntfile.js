'use strict';

module.exports = function(grunt){
  grunt.initConfig({
    // http://fairwaytech.com/2014/01/understanding-grunt-part-2-automated-testing-with-mocha/
    simplemocha: {
      options: {
        globals: ['expect'],
        timeout: 3000,
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
      client: ['public/js/**/*.js'],
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.registerTask('build:debug', 'minimal processing', ['jshint', 'clean:js', 'concat:js']);
  grunt.registerTask('build:release', 'Concatenate and minify js files', ['jshint', 'clean:js', 'concat:js', 'uglify:bundle']);
  
  grunt.registerTask('timestamp', function() {
    var options = this.options({
      file: '.timestamp'
    });
    var timestamp = new Date();
    var contents = timestamp.toString();
    grunt.file.write(options.file, contents);
  });
  // Add a default task. This is optional, of course :) 
  grunt.registerTask('default', 'simplemocha');
};