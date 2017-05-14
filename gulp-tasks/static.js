const gulp = require('gulp')
const cached = require('gulp-cached')

module.exports = {
  favicon: function() {
    return gulp.src('src/images/favicon.ico')
      .pipe(cached('static_favicon'))
      .pipe(gulp.dest('./dist'))
  },
  image: function() {
    return gulp.src('src/images/static/**/*', { base: './src/images/static' })
      .pipe(cached('static_image'))
      .pipe(gulp.dest('./dist/images'))
  },
  js: function() {
    return gulp.src('src/js/vendor/*')
      .pipe(cached('static_js'))
      .pipe(gulp.dest('./dist/js/vendor'))
  },
  shower: function() {
    return gulp.src('src/shower/**/*')
      .pipe(cached('static_shower'))
      .pipe(gulp.dest('./dist/shower'))
  }
}
