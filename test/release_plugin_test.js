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

exports.release_plugin = {
    setUp: function (done) {
        var createRepoWithOneTagCommand = 'cd test; mkdir test-repo; cd test-repo; git init; ' +
            'touch initial-file.js; git add initial-file.js; git commit -m "test"; git tag -a test-1.1.1 -m "test-1.1.1"';

        cp.exec(createRepoWithOneTagCommand, function () {
            done();
        });
    },
    tearDown: function (callback) {
        var removeCreatedRepoCommand = 'cd test; rm -rf test-repo';

        cp.exec(removeCreatedRepoCommand, function () {
            callback();
        });
    },
    currentVersionRelease: function (test) {
        test.expect(1);

        callGrunt('gruntfile.js', 'currentVersion', function (error, stdout) {
            var expected = '{"currentVersion":"1.1.1"}',
            actual = getJsonFromOutput(stdout);

            test.equal(actual, expected, 'should return current release project version');
            test.done();
        });
    },

    currentVersionSnapshot: function (test) {
        var commitOneFileCommand = 'cd test/test-repo/; touch file.js; git add file.js; git commit -m "test"';

        test.expect(1);

        cp.exec(commitOneFileCommand, function () {
            callGrunt('gruntfile.js', 'currentVersion', function (error, stdout) {
                var expected = '{"currentVersion":"1.1.2-SNAPSHOT"}',
                actual = getJsonFromOutput(stdout);

                test.equal(actual, expected, 'should return current snapshot project version');
                test.done();
            });
        });
    },

    metadataRelease: function (test) {
        test.expect(1);

        callGrunt('gruntfile.js', 'metadata', function (error, stdout) {
            var expected = '{"version":"1.1.1","name":"some-name","domain":"some-domain"}',
            actual = getJsonFromOutput(stdout);

            test.equal(actual, expected, 'should return project metadata with release version');
            test.done();
        });
    },

    metadataSnapshot: function (test) {
        var commitOneFileCommand = 'cd test/test-repo/; touch file.js; git add file.js; git commit -m "test"';

        test.expect(1);

        cp.exec(commitOneFileCommand, function () {
            callGrunt('gruntfile.js', 'metadata', function (error, stdout) {
                var expected = '{"version":"1.1.2-SNAPSHOT","name":"some-name","domain":"some-domain"}',
                actual = getJsonFromOutput(stdout);

                test.equal(actual, expected, 'should return project metadata with snapshot version');
                test.done();
            });
        });
    }
};
