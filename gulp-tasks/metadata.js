const gulp = require('gulp')
const fs = require('fs')
const through = require('through2')
const readline = require('readline')
const cached = require('gulp-cached')
const concat = require('gulp-concat')

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
  var rl = readline.createInterface({
    input: String(chunk.contents)
  }).on('line', (line) => {
    if (line.match(/^\.meta-data\ end/)) {
      // stop reading
      console.log('stop', line)
    } else if (line.match(/^\.meta-data/)) {
      console.log(line)
    }
  })
  cb(null, chunk)
}

module.exports = function() {
  return gulp.src('src/posts/*.slm')
    .pipe(cached('metadata'))
    .pipe(through.obj(fetchMetadata))
    .pipe(concat('metadata.js'))
    .pipe(gulp.dest('./src/js/consts/'))
}
