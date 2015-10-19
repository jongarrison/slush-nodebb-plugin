#! /usr/bin/env node

var gulp = global.gulp = require('gulp');
require('./slushfile.js');
var util = require('util');


//interaction
gulp.start(
    'default',
    function (err, done) {
      if (err) {
        console.log("Error: " + util.inspect(err));
      }
      if (typeof done === 'function') {
        done();
      }
    });
