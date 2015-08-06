# grunt-release-plugin

> Calculate project version from git tags and mark SNAPSHOT versions.

This plugin has two tasks: 
* `currentVersion` which calculates and prints projects current version object on the screen,
* `metadata` which prints all metatadata with calculated projects current version.
* `compress` which is a [grunt-contrib-compress](https://github.com/gruntjs/grunt-contrib-compress) task. The path for created package is always the same - `target/universal/projectName-calculatedCurrentVersion.zip`

It is very useful when you need to calculate your project version in CI.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-release-plugin --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-release-plugin');
```

## The "release_plugin" task

### Overview
In your project's Gruntfile, add a section named `release_plugin` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  release_plugin: {
    options: {
      // Task-specific options go here.
    },
    currentVersion: {},
    metadata: {},
    compress: {...}
  }
});
```

### Options

#### options.repo
Type: `String`
Default value: `.`

A string value describes path to repository, usually current folder `.`.

#### options.pkg
Type: `Object`
Default value: `{}`

An object with version (which will be replaced) any any other stuff returned by metadata task, usually `package.json`

### Usage Examples

#### Default Options
```js
grunt.initConfig({
  release_plugin: {
    options: {
      repo: ".",
      pkg: grunt.file.readJSON('package.json')
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
```

#### Shell example

```shell
git init
touch file.js
git add file.js
git commit -m "add file.js"
git tag -a v0.1.0 -m "v0.1.0"
grunt release_plugin:currentVersion #will return {"currentVersion":"0.1.0"}

touch file2.js
git add file2.js
git commit -m "add file2.js"
grunt release_plugin:currentVersion #will return {"currentVersion":"0.1.1-SNAPSHOT"}

git tag -a v0.1.1 -m "v0.1.1"
grunt release_plugin:currentVersion #will return {"currentVersion":"0.1.1"}
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 2015-07-29   v1.1.2   Fix loading compress plugin
* 2015-07-29   v1.1.1   Fix dependencies
* 2015-07-29   v1.1.0   Add compress task
* 2015-07-23   v0.1.0   First version of grunt-release-plugin
