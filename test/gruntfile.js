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
    release_plugin: {
      options: {
        repo: './test-repo',
        pkg: grunt.file.readJSON('../package.json')
      },
      currentVersion: {},
      metadata: {}
    }
  });

  grunt.loadTasks('../tasks');
};
