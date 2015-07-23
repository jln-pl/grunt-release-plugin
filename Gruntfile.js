/*
 * grunt-release-plugin
 * https://github.com/jln-pl/grunt-release-plugin
 *
 * Copyright (c) 2015 Jerzy Jelinek
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    release_plugin: {
      options: {
        repo: '.',
        pkg: grunt.file.readJSON('package.json')
      },
      currentVersion: {},
      metadata: {}
    },

    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['nodeunit']);
  grunt.registerTask('default', ['jshint', 'test']);

};
