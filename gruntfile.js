module.exports = function(grunt){

  // configuration
  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: true,
        },
        files: {
          'dist/style.min.css': 'src/less/style.less'
        },
      },
    },
    uglify: {
      options: {
        compress: false
      },
      game: {
        files: {
          'dist/game.min.js': ['src/js/extendArray.js','src/js/tile.js','src/js/game.js'],
        },
      },
      bootstrap: {
        files: {
          'dist/bootstrap.min.js': [
              'src/bootstrap/js/button.js',
              'src/bootstrap/js/modal.js',
              'src/bootstrap/js/collapse.js',
              'src/bootstrap/js/transition.js'
              ]
        },
      },
    },
    // the watcher
    watch: {
      css: {
        files: 'src/less/*.less',
        tasks: ['less'],
        options: {
          livereload: true,
        },
      },
      scripts: {
        files: ['src/js/game.js','src/js/tile.js'],
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

