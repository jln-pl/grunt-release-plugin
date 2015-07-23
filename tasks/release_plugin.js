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

    function markSnapshotVersion(version, patch) {
        return version.slice(0, patch.index) + patch.value + "-SNAPSHOT";
    }

    function prepareCurrentVersion(version, tagContainedCommit, patch) {
        var currentVersion = {
            currentVersion: version
        };

        if (tagContainedCommit.trim().length == 0) {
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

    function compareWithTagCommit(tag, commit, repo, done) {
        var compareCommand = 'git tag --contains ' + commit;

        cp.exec(compareCommand, {cwd: repo}, function (err, tagContainedCommit) {
            var version = getVersionFromTag(tag),
            patch = getPatch(version),
            currentVersion = prepareCurrentVersion(version, tagContainedCommit.trim(), patch);

            grunt.log.writeln(JSON.stringify(currentVersion));
            done();
        });
    }

    function checkLastCommit(tag, repo, done) {
        var lastCommitCommand = 'git rev-parse --short HEAD';

        cp.exec(lastCommitCommand, {cwd: repo}, function (err, commit) {
            compareWithTagCommit(tag, commit.trim(), repo, done);
        });
    }

    function getCurrentVersion(repo, done) {
        var lastTagCommand = 'git describe --abbrev=0 --tags';

        cp.exec(lastTagCommand, {cwd: repo}, function (err, lastTag) {
            checkLastCommit(lastTag, repo, done);
        });
    }

    grunt.registerMultiTask('release_plugin', 'Calculate project version from git tags and mark SNAPSHOT versions.', function () {
        var done = this.async(),
        options = this.options({
            repo: '.',
            pkg: {}
        });

        if (this.target === 'currentVersion') {
            getCurrentVersion(options.repo, done);
        } else if (this.target === 'metadata') {

        }
    });

};
