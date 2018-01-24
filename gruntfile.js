module.exports = function(grunt){

  // configuration
  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: true,
        },
        files: {
          'css/style.min.css': 'less/style.less'
        },
      },
    },
    uglify: {
      options: {
        compress: false
      },
      game: {
        files: {
          'js/game.min.js': ['js/extendArray.js','js/tile.js','js/game.js'],
        },
      },
      bootstrap: {
        files: {
          'js/bootstrap.min.js': ['bootstrap/js/button.js','bootstrap/js/modal.js','bootstrap/js/collapse.js','bootstrap/js/transition.js']
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
        files: ['js/game.js','js/tile.js'],
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

