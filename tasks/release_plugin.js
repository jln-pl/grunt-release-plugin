/*
 * grunt-release-plugin
 * https://github.com/jln-pl/grunt-release-plugin
 *
 * Copyright (c) 2015 Jerzy Jelinek
 * Licensed under the MIT license.
 */

'use strict';

var cp = require('child_process');

module.exports = function (grunt) {

    var done, options, target, data;

    function markSnapshotVersion(version, patch) {
        return version.slice(0, patch.index) + patch.value + "-SNAPSHOT";
    }

    function prepareCurrentVersion(version, tagContainedCommit, patch) {
        var currentVersion = {
            currentVersion: version
        };

        if (tagContainedCommit.trim().length === 0) {
            currentVersion.currentVersion = markSnapshotVersion(version, patch);
        }

        return currentVersion;
    }

    function getPatch(version) {
        var patchIndex = version.lastIndexOf('.') + 1;

        return {
            index: patchIndex,
            value: parseInt(version.substr(patchIndex, version.length), 10) + 1
        };
    }

    function getVersionFromTag(tag) {
        return tag.match(/[\d\.+]+/)[0];
    }

    function compareWithTagCommit(tag, commit) {
        var compareCommand = 'git tag --contains ' + commit;

        cp.exec(compareCommand, {cwd: options.repo}, function (err, tagContainedCommit) {
            if (err) {
                grunt.log.error('Checking if tag contains commit failed');
            }

            var version = getVersionFromTag(tag),
            patch = getPatch(version),
            currentVersion = prepareCurrentVersion(version, tagContainedCommit.trim(), patch);

            if (target === 'currentVersion') {
                grunt.log.writeln(JSON.stringify(currentVersion));
            } else if (target === 'metadata') {
                options.pkg.version = currentVersion.currentVersion;
                grunt.log.writeln(JSON.stringify(options.pkg));
            } else if (target === 'compress') {
                grunt.config.set('compress', data);
                grunt.config.set('compress.main.options.archive', 'target/universal/'+ options.pkg.name + '-' + currentVersion.currentVersion + '.zip');
                grunt.task.run(['compress']);
            }

            done();
        });
    }

    function checkLastCommit(tag) {
        var lastCommitCommand = 'git rev-parse --short HEAD';

        cp.exec(lastCommitCommand, {cwd: options.repo}, function (err, commit) {
            if (err) {
                grunt.log.error('Cannot read last commit hash');
            }

            compareWithTagCommit(tag, commit.trim());
        });
    }

    if(!grunt.loadTasks('node_modules/grunt-release-plugin/node_modules/grunt-contrib-compress/tasks')) {
        grunt.loadNpmTasks('grunt-contrib-compress');
    }

    grunt.registerMultiTask('release_plugin', 'Calculate project version from git tags and mark SNAPSHOT versions.', function () {
        var lastTagCommand = 'git describe --abbrev=0 --tags';

        done = this.async();
        target = this.target;
        data = this.data;
        options = this.options({
            repo: '.',
            pkg: {}
        });

        cp.exec(lastTagCommand, {cwd: options.repo}, function (err, lastTag) {
            if (err) {
                grunt.log.error('Repository does not contain tags, defaulting to version 0.0.0');
                checkLastCommit('0.0.0');
            } else {
                checkLastCommit(lastTag);
            }
        });
    });

};
