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

    function markSnapshotVersion(version, patch, distance) {
        var suffix = "-SNAPSHOT";

        if (options.useDistance) {
            suffix = suffix + distance.trim();
        }

        return version.slice(0, patch.index) + patch.value + suffix;
    }

    function prepareCurrentVersion(version, tagContainedCommit, patch, distance) {
        var currentVersion = {
            currentVersion: version
        };

        if (tagContainedCommit.trim().length === 0) {
            currentVersion.currentVersion = markSnapshotVersion(version, patch, distance);
        }

        return currentVersion;
    }

    function getCommitDistanceFromTag(tag, commit) {
        var distanceCommand = 'git rev-list ' + tag.trim() + '...' + commit.trim() + ' --count';

        cp.exec(distanceCommand, {cwd: options.repo}, function (err, distance) {
            if (err) {
                grunt.log.error('Could not find commit distance from tag');
            }

            compareWithTagCommit(tag, commit.trim(), distance.trim());
        });
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

    function compareWithTagCommit(tag, commit, distance) {
        var compareCommand = 'git tag --contains ' + commit;

        cp.exec(compareCommand, {cwd: options.repo}, function (err, tagContainedCommit) {
            if (err) {
                grunt.log.error('Checking if tag contains commit failed');
            }

            var version = getVersionFromTag(tag),
            patch = getPatch(version),
            currentVersion = prepareCurrentVersion(version, tagContainedCommit.trim(), patch, distance);

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

            getCommitDistanceFromTag(tag, commit.trim());
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
            pkg: {},
            useDistance: false
        });

        cp.exec(lastTagCommand, {cwd: options.repo}, function (err, lastTag) {
            if (err) {
                grunt.log.error('Repository does not contain tags');
            }

            checkLastCommit(lastTag);
        });
    });

};
