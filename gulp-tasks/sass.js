const gulp = require('gulp')
const cached = require('gulp-cached')
const compass = require('gulp-compass')

module.exports = function() {
  return gulp.src('src/sass/application.sass')
    .pipe(cached('sass'))
    .pipe(compass({
      sass: 'src/sass/',
      css: 'dist/css/',
      image: 'dist/images/',
      style: 'compressed',
      comments: false
    }));
}
