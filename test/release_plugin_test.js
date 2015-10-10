'use strict';

var grunt = require('grunt'),
cp = require('child_process');

function callGrunt(filename, command, callback) {
    var gruntCommand = '../node_modules/.bin/grunt --gruntfile ' + filename + ' release_plugin:' + command,
    options = {cwd: 'test/'};

    cp.exec(gruntCommand, options, callback);
}

function getJsonFromOutput(output) {
    var start = output.indexOf('{'),
    end = output.indexOf('}') - start + 1;

    return output.substr(start, end);
}

function setUpTests(additionalCommand, done) {
    var createRepoWithOneTagCommand = 'cd test; npm install; mkdir test-repo; cd test-repo; git init; ' +
        'touch initial-file.js; git add initial-file.js; git commit -m "test"; ' + additionalCommand;

    cp.exec(createRepoWithOneTagCommand, function () {
        done();
    });
}

function tearDownTests(callback) {
    var removeCreatedRepoCommand = 'cd test; rm -rf test-repo target node_modules;';

    cp.exec(removeCreatedRepoCommand, function () {
        callback();
    });
}

exports.release_plugin_release = {
    setUp: function (done) {
        setUpTests('git tag -a test-1.1.1 -m "test-1.1.1"; ', done);
    },

    tearDown: tearDownTests,

    currentVersion: function (test) {
        test.expect(1);

        callGrunt('gruntfile.js', 'currentVersion', function (error, stdout) {
            var expected = '{"currentVersion":"1.1.1"}',
            actual = getJsonFromOutput(stdout);

            test.equal(actual, expected, 'should return current release project version');
            test.done();
        });
    },

    metadata: function (test) {
        test.expect(1);

        callGrunt('gruntfile.js', 'metadata', function (error, stdout) {
            var expected = '{"version":"1.1.1","name":"some-name","domain":"some-domain"}',
            actual = getJsonFromOutput(stdout);

            test.equal(actual, expected, 'should return project metadata with release version');
            test.done();
        });
    },

    compress: function (test) {
        test.expect(1);

        callGrunt('gruntfile.js', 'compress', function () {
            test.ok(grunt.file.exists('test/target/universal/some-name-1.1.1.zip'), 'should make zip file with release version');
            test.done();
        });
    }
};

exports.release_plugin_snapshot = {
    setUp: function (done) {
        setUpTests('git tag -a test-1.1.1 -m "test-1.1.1"; touch file.js; git add file.js; git commit -m "test"', done);
    },

    tearDown: tearDownTests,

    currentVersion: function (test) {
        test.expect(1);

        callGrunt('gruntfile.js', 'currentVersion', function (error, stdout) {
            var expected = '{"currentVersion":"1.1.2-SNAPSHOT"}',
            actual = getJsonFromOutput(stdout);

            test.equal(actual, expected, 'should return current snapshot project version');
            test.done();
        });
    },

    metadata: function (test) {
        test.expect(1);

        callGrunt('gruntfile.js', 'metadata', function (error, stdout) {
            var expected = '{"version":"1.1.2-SNAPSHOT","name":"some-name","domain":"some-domain"}',
            actual = getJsonFromOutput(stdout);

            test.equal(actual, expected, 'should return project metadata with snapshot version');
            test.done();
        });
    },

    compress: function (test) {
        test.expect(1);

        callGrunt('gruntfile.js', 'compress', function () {
            test.ok(grunt.file.exists('test/target/universal/some-name-1.1.2-SNAPSHOT.zip'), 'should make zip file with snapshot version');
            test.done();
        });
    }
};

exports.release_plugin_snapshot_no_tag = {
    setUp: function (done) {
        setUpTests('', done);
    },

    tearDown: tearDownTests,

    currentVersion: function (test) {
        test.expect(1);

        callGrunt('gruntfile.js', 'currentVersion', function (error, stdout) {
            var expected = '{"currentVersion":"0.0.1-SNAPSHOT"}',
            actual = getJsonFromOutput(stdout);

            test.equal(actual, expected, 'should return "0.0.1-SNAPSHOT" project version');
            test.done();
        });
    },

    metadata: function (test) {
        test.expect(1);

        callGrunt('gruntfile.js', 'metadata', function (error, stdout) {
            var expected = '{"version":"0.0.1-SNAPSHOT","name":"some-name","domain":"some-domain"}',
            actual = getJsonFromOutput(stdout);

            test.equal(actual, expected, 'should return project metadata with "0.0.1-SNAPSHOT" version');
            test.done();
        });
    },

    compress: function (test) {
        test.expect(1);

        callGrunt('gruntfile.js', 'compress', function () {
            test.ok(grunt.file.exists('test/target/universal/some-name-0.0.1-SNAPSHOT.zip'), 'should make zip file with "0.0.1-SNAPSHOT" version');
            test.done();
        });
    }
};
