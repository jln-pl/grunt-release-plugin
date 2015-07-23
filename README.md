# grunt-release-plugin

> Calculate project version from git tags and mark SNAPSHOT versions.

This plugin has two tasks: 
* `currentVersion` which calculate and prints projects current version object on the screen,
* `metadata` which prints all metatadata with calculated projects current version.

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
    metadata: {}
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
    metadata: {}
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
