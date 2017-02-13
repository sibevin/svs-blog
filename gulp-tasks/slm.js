const gulp = require('gulp')
const slm = require('gulp-slm')
const fs = require('fs')
const path = require('path')
const through = require('through2')
const slmCompile = require('slm').compile
const cached = require('gulp-cached')

const simpleSlmCompile = function(layoutSlm, chunk) {
  return slmCompile(layoutSlm, null)({
    content: String(chunk.contents)
  })
}

const postSlmCompile = function(layoutSlm, chunk) {
  console.log('chunk', chunk.path)
  console.log('chunk.content', String(chunk.contents))
  return slmCompile(layoutSlm, null)({
    content: String(chunk.contents),
    file: path.basename(chunk.path, '.html')
  })
}

const PAGE_TYPES = {
  index: {
    layout: './src/layouts/application.slm',
    compile: simpleSlmCompile
  },
  views: {
    layout: './src/layouts/application.slm',
    compile: simpleSlmCompile
  },
  posts: {
    layout: './src/layouts/application.slm',
    compile: postSlmCompile
  }
}


var embedHtmlContent = function(pageType) {
  return function(chunk, enc, cb) {
    var pageTypeData = PAGE_TYPES[pageType]
    var layoutSlm = fs.readFileSync(pageTypeData['layout'], 'utf8')
    var pageHtml = pageTypeData['compile'](layoutSlm, chunk)
    chunk.contents = new Buffer(pageHtml)
    cb(null, chunk)
  }
}

module.exports = {
  index: function() {
    return gulp.src('src/index.slm')
      .pipe(cached('index'))
      .pipe(slm())
      .pipe(through.obj(embedHtmlContent('index')))
      .pipe(gulp.dest('./dist/'))
  },
  views: function() {
    return gulp.src('src/views/*.slm')
      .pipe(cached('views'))
      .pipe(slm())
      .pipe(through.obj(embedHtmlContent('views')))
      .pipe(gulp.dest('./dist/views'))
  },
  posts: function() {
    return gulp.src('src/posts/*.slm')
      .pipe(cached('posts'))
      .pipe(slm())
      .on('error', function(error) {
        debugger
        console.log('error', error)
      })
      .pipe(through.obj(embedHtmlContent('posts')))
      .pipe(gulp.dest('./dist/posts'))
  }
}
