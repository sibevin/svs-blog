const gulp = require('gulp')
const slm = require('gulp-slm')
const fs = require('fs')
const path = require('path')
const through = require('through2')
const slmCompile = require('slm').compile
const cached = require('gulp-cached')
const htmlParser = require('htmlparser2');

const buildHtml = function(layoutSlm, chunk) {
  var appData = JSON.parse(fs.readFileSync('./config/app.json', 'utf8'))
  var content = String(chunk.contents)
  var data = {}
  var handler = new htmlParser.DomHandler(function(err, dom){
    if (err) {
      console.log('err', err)
    } else {
      for (ele of dom) {
        if (ele.name === 'div' && ele.attribs.class === 'meta-data') {
          var rawMeta = ele.children[0].data
          if (rawMeta === 'end') {
            break
          } else if (rawMeta === 'draft') {
            data['draft'] = true
          } else {
            var result = rawMeta.match(/^([^ ]*)\ (.*)$/)
            if (result !== null) {
              data[result[1]] = result[2]
            }
          }
        }
      }
    }
  })
  var parser = new htmlParser.Parser(handler)
  parser.write(content)
  parser.end()
  console.log('chunk', chunk.path)
  console.log('data', data)
  var title = appData.name || ''
  if (data.title !== undefined) {
    title = data.title + ' | ' + appData.name
  }
  console.log('title', title)
  return slmCompile(layoutSlm, null)({
    content: content,
    file: data.file || '',
    title: title,
    keywords: data.tags || appData.tags,
    description: data.description || appData.description
  })
}

const PAGE_TYPES = {
  index: {
    layout: './src/layouts/application.slm',
    compile: buildHtml
  },
  views: {
    layout: './src/layouts/application.slm',
    compile: buildHtml
  },
  posts: {
    layout: './src/layouts/post.slm',
    compile: buildHtml
  }
}


const embedHtmlContent = function(pageType) {
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
      .pipe(gulp.dest('./dist/'))
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
      .pipe(gulp.dest('./dist/post'))
  }
}
