#!/usr/bin/env node

/* eslint camelcase:0 */
/* eslint no-process-exit:0 */

"use strict";

var grunt = require('grunt');

// hack to avoid loading a Gruntfile
// You can skip this and just use a Gruntfile instead
grunt.task.init = function() {};

// Init config
grunt.initConfig({
  'download-atom-shell': {
    version: '0.20.3',
    outputDir: 'build'
  }
});

// Register your own tasks
grunt.registerTask('spawn-shell', function() {
  grunt.log.write('Running atom-shell');
  grunt.util.spawn({
    cmd: './build/atom-shell/atom',
    args: ['./hello-atom']
  }, function() {});
});

// Load tasks from npm
grunt.loadNpmTasks('grunt-download-atom-shell');

// Finally run the tasks, with options and a callback when we're done
grunt.tasks(['download-atom-shell', 'spawn-shell'], {}, function() {
  grunt.log.ok('Done running tasks.');
});
