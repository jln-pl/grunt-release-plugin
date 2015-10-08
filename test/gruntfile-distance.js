/*
 * grunt-release-plugin
 * https://github.com/jln-pl/grunt-release-plugin
 *
 * Copyright (c) 2015 Jerzy Jelinek
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: {version: 'build with release plugin', name: 'some-name', domain: 'some-domain'},
        release_plugin: {
            options: {
                repo: './test-repo',
                pkg: '<%= pkg %>',
                useDistance: true
            },
            currentVersion: {},
            metadata: {},
            compress: {
                main: {
                    files: [
                        {
                            src: ['./dist/*'],
                            dest: '<%= pkg.name %>/',
                            filter: 'isFile'
                        }
                    ]
                }
            }
        }
    });

    grunt.loadTasks('../tasks');
};
