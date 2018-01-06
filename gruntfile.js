module.exports = function(grunt){

  // configuration
  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: true,
        },
        files: {
          'style.min.css': 'less/style.less'
        },
      },
    },
    uglify: {
      my_target: {
        files: {
          'script.min.js': ['js/*.js']
        },
      },
    },
    // the watcher
    watch: {
      css: {
        files: 'less/*.less',
        tasks: ['less'],
        options: {
          livereload: true,
        },
      },
      scripts: {
        files: 'js/*.js',
        tasks: ['uglify'],
      },
    },
  });

  // load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // register tasks
  grunt.registerTask('run', ['less','uglify']);

};

