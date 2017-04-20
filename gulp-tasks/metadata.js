const gulp = require('gulp')
const fs = require('fs')
const through = require('through2')
const readline = require('readline')
const cached = require('gulp-cached')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const merge = require('merge2')
const _ = require('lodash')

var fetchMetadata = function(chunk, enc, cb) {
  var content = String(chunk.contents)
  var lines = content.split("\n")
  var data = {}
  for (var line of lines) {
    if (line.match(/^\.meta-data\ end/)) {
      break
    } else {
      var result = line.match(/^\.meta-data\ ([^ ]*)\ (.*)$/)
      if (result !== null) {
        if (result[1] === 'tags') {
          data[result[1]] = result[2].split(',')
        } else {
          data[result[1]] = result[2]
        }
      } else {
        result = line.match(/^\.meta-data\ ([^ ]*)$/)
        if (result !== null && result[1] === 'draft') {
          data['draft'] = true
        }
      }
    }
  }
  if (Object.keys(data).length === 0) {
    chunk.contents = new Buffer('')
  } else {
    chunk.contents = new Buffer('"'+ data['file'] + '":' + JSON.stringify(data) + ',')
  }
  cb(null, chunk)
}

var fetchTag = function(chunk, enc, cb) {
  var content = String(chunk.contents)
  var lines = content.split("\n")
  var tags = ''
  var reg = /^\.meta-data\ tags\ (.*)$/
  for (var line of lines) {
    var result = line.match(reg)
    if (result !== null) {
      tags = result[1]
      break
    }
  }
  if (tags !== '') {
    chunk.contents = new Buffer(tags + ',')
  } else {
    chunk.contents = new Buffer('')
  }
  cb(null, chunk)
}

var buildPostConst = function(chunk, enc, cb) {
  var content = 'var POSTS = {' + String(chunk.contents).replace(/[\r\n]/g, '').slice(0, -1) + '};'
  chunk.contents = new Buffer(content)
  cb(null, chunk)
}

var addTag = function(tagData, tag) {
  if (tagData[tag] === undefined) {
    tagData[tag] = { count: 1 }
  }
  if (tagData[tag]['name'] === undefined) {
    var tagName = _.map(tag.split('_'), _.upperFirst).join(' > ')
    tagName = _.map(tagName.split('-'), _.upperFirst).join(' ')
    tagData[tag]['name'] = tagName
  }
  if (tagData[tag]['count'] === undefined) {
    tagData[tag]['count'] = 1
  } else {
    tagData[tag]['count'] = tagData[tag]['count'] + 1
  }
  if (tagData[tag]['color'] === undefined) {
    var tagSubs = tag.split('_')
    if (tagSubs.length > 0) {
      var combinedTag = ''
      for (var tagSub of tagSubs) {
        if (combinedTag === '') {
          combinedTag = tagSub
        } else {
          combinedTag = combinedTag + '_' + tagSub
        }
        if (tagData[combinedTag] !== undefined && tagData[combinedTag]['color'] !== undefined ) {
          tagData[tag]['color'] = tagData[combinedTag]['color']
          break
        }
      }
    }
  }
  return tagData
}

var buildTagConst = function(chunk, enc, cb) {
  console.log('build_tag', String(chunk.contents))
  var tags = String(chunk.contents).slice(0, -1).replace(/[\r\n]/g, '').split(',')
  console.log('tags', tags)
  var tagData = JSON.parse(fs.readFileSync('./config/tags.json', 'utf8'))
  console.log('tagData', tagData)
  for (tag of tags) {
    var tagSubs = tag.split('_')
    if (tagSubs.length > 0) {
      var combinedTags = []
      for (var tagSub of tagSubs) {
        combinedTags.push(tagSub)
        tagData = addTag(tagData, combinedTags.join('_'))
      }
    } else {
      tagData = addTag(tagData, tag)
    }
  }
  console.log('tagData2', tagData)
  var content = 'var TAGS = ' + JSON.stringify(tagData) + ';'
  chunk.contents = new Buffer(content)
  cb(null, chunk)
}

var buildCategoryConst = function(chunk, enc, cb) {
  var caData = JSON.parse(fs.readFileSync('./config/categories.json', 'utf8'))
  var content = String(chunk.contents) + 'var CATEGORIES = ' + JSON.stringify(caData) + ';'
  chunk.contents = new Buffer(content)
  console.log('content', content)
  cb(null, chunk)
}


module.exports = function() {
  var postsData = gulp.src(['src/posts/*.slm', 'src/bookmarks/*.slm'])
      .pipe(through.obj(fetchMetadata))
      .pipe(concat('posts.js'))
      .pipe(through.obj(buildPostConst))

  var tagsData = gulp.src(['src/posts/*.slm', 'src/bookmarks/*.slm'])
      .pipe(through.obj(fetchTag))
      .pipe(concat('tags.js'))
      .pipe(through.obj(buildTagConst))

  return merge(postsData, tagsData)
      .pipe(concat('metadata.js'))
      .pipe(through.obj(buildCategoryConst))
      .pipe(uglify())
      .pipe(gulp.dest('dist/js/consts/'))
}
