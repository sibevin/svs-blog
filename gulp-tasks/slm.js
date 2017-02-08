const gulp = require('gulp')
const slm = require('gulp-slm')
const fs = require('fs')
const through = require('through2')
const slm_compile = require('slm').compile
const cached = require('gulp-cached')

var embedHtmlContent = function(layoutPath) {
  return function(chunk, enc, cb) {
    var contentHtml = String(chunk.contents)
    var layoutSlm = fs.readFileSync(layoutPath, 'utf8')
    var pageHtml = slm_compile(layoutSlm, null)({
      content: contentHtml
    })
    chunk.contents = new Buffer(pageHtml)
    cb(null, chunk)
  }
}

module.exports = {
  index: function() {
    return gulp.src('src/index.slm')
      .pipe(cached('index'))
      .pipe(slm())
      .pipe(through.obj(embedHtmlContent('./src/layouts/application.slm')))
      .pipe(gulp.dest('./dist/'))
  },
  views: function() {
    return gulp.src('src/views/*.slm')
      .pipe(cached('views'))
      .pipe(slm())
      .pipe(through.obj(embedHtmlContent('./src/layouts/application.slm')))
      .pipe(gulp.dest('./dist/views'))
  },
  posts: function() {
    return gulp.src('src/posts/*.slm')
      .pipe(cached('posts'))
      .pipe(slm())
      .pipe(through.obj(embedHtmlContent('./src/layouts/application.slm')))
      .pipe(gulp.dest('./dist/posts'))
  }
}
