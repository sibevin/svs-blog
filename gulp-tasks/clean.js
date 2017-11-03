var gulp = require('gulp');
var clean = require('gulp-clean');
var cache = require('gulp-cached');

module.exports = function() {
  cache.caches = {};
  return gulp.src('dist/', {
      read: false
    })
    .pipe(clean())
};
