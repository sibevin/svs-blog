var gulp = require('gulp');
var webpack = require('webpack-stream');

module.exports = function() {
  return gulp.src('src/entry.js')
    .pipe(webpack(require('../build/webpack.base.conf.js')))
    .pipe(gulp.dest('dist/'));
};
