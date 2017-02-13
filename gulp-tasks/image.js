const gulp = require('gulp')
const cached = require('gulp-cached')

module.exports = {
  favicon: function() {
    return gulp.src('src/images/favicon.ico')
      .pipe(cached('favicon_images'))
      .pipe(gulp.dest('./dist/'))
  },
  static: function() {
    return gulp.src('src/images/static/**/*', { base: './src/images/static' })
      .pipe(cached('static_images'))
      .pipe(gulp.dest('./dist/images'))
  }
}
