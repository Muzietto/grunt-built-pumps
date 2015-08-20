'use strict';

module.exports = function(grunt){
  grunt.initConfig({
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
      server: ['public/js/**/*.js'],
      support: ['public/js/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

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
};