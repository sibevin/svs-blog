const gulp = require('gulp')
const fs = require('fs')
const through = require('through2')
const readline = require('readline')
const cached = require('gulp-cached')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')

var fetchAllMetadata = function(chunk, enc, cb) {
  var targetFolder = './src/posts/'
  var paths = fs.readdirSync(targetFolder)
  var metas = []
  paths.forEach(function(filePath){
    var rl = readline.createInterface({
      input: fs.createReadStream(targetFolder + filePath)
    }).on('line', (line) => {
      if (line.match(/^\.meta-data\ end/)) {
        // stop reading
        console.log('stop', line)
      } else if (line.match(/^\.meta-data/)) {
        console.log(line)
      }
    })
  })
  console.log(chunk.path)
  cb(null, chunk)
}

var fetchMetadata = function(chunk, enc, cb) {
  var content = String(chunk.contents)
  var lines = content.split("\n")
  var data = {}
  var reg = /^\.meta-data\ ([^ ]*)\ (.*)$/
  for (var line of lines) {
    if (line.match(/^\.meta-data\ end/)) {
      break
    } else {
      var result = line.match(reg)
      if (result !== null) {
        data[result[1]] = result[2]
      }
    }
  }
  if (Object.keys(data).length === 0) {
    chunk.contents = new Buffer('')
  } else {
    chunk.contents = new Buffer(JSON.stringify(data) + ',')
  }
  cb(null, chunk)
}

var buildConst = function(chunk, enc, cb) {
  var content = 'var POSTS = [' + String(chunk.contents).slice(0, -2) + '];'
  chunk.contents = new Buffer(content)
  cb(null, chunk)
}

module.exports = function() {
  return gulp.src('src/posts/*.slm')
    //.pipe(cached('metadata'))
    .pipe(through.obj(fetchMetadata))
    .pipe(concat('metadata.js'))
    .pipe(through.obj(buildConst))
    .pipe(uglify())
    .pipe(gulp.dest('./src/js/consts/'))
}
