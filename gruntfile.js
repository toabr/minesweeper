module.exports = function (grunt) {

  // configuration
  grunt.initConfig({
    less: {
      dist: {
        options: {
          compress: true,
        },
        files: {
          'dist/style.min.css': 'src/less/style.less',
        },
      },
    },
    uglify: {
      options: {
        compress: false,
      },
      game: {
        files: {
          'dist/game.min.js': [
            'src/js/extendArray.js',
            'src/js/tile.js',
            'src/js/game.js',
          ],
        },
      },
      bootstrap: {
        files: {
          'dist/bootstrap.min.js': [
            'node_modules/bootstrap-less/js/button.js',
            'node_modules/bootstrap-less/js/modal.js',
            'node_modules/bootstrap-less/js/collapse.js',
            'node_modules/bootstrap-less/js/transition.js',
          ],
        },
      },
    },
    copy: {
      index: {
        src: 'src/index.html',
        dest: 'dist/index.html'
      },
      fonts: {
        cwd: 'node_modules/bootstrap-less/fonts', 
        src: '*',
        dest: 'dist/fonts/',
        expand: true,
      },
    },
    /* 
        ### watch
    */
    watch: {
      css: {
        files: 'src/less/*.less',
        tasks: ['less'],
        options: {
          livereload: true,
        },
      },
      scripts: {
        files: ['src/js/game.js', 'src/js/tile.js'],
        tasks: ['uglify'],
      },
    },
  });

  // load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // register tasks
  grunt.registerTask('style', ['less']);
  grunt.registerTask('code', ['uglify']);
  grunt.registerTask('kopie', ['copy']);

  grunt.registerTask('build', ['less', 'uglify', 'copy']);

};

