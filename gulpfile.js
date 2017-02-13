const gulp = require('gulp');
const requireDir = require('require-dir');
const tasks = requireDir('./gulp-tasks');

gulp.task('slm-index', tasks.slm.index);
gulp.task('slm-views', tasks.slm.views);
gulp.task('slm-posts', tasks.slm.posts);
gulp.task('webpack', tasks.webpack);
gulp.task('metadata', tasks.metadata);
gulp.task('sass', tasks.sass);
gulp.task('img-favicon', tasks.image.favicon);
gulp.task('img-static', tasks.image.static);
gulp.task('clean', tasks.clean);

gulp.task('default', ['build-slm', 'copy-img', 'metadata', 'webpack']);
gulp.task('build-slm', ['slm-index', 'slm-views', 'slm-posts']);
gulp.task('copy-img', ['img-favicon', 'img-static']);

gulp.task('watch', function(){
  gulp.watch('src/index.slm', ['slm-index']);
  gulp.watch('src/posts/*.slm', ['slm-posts', 'metadata']);
  gulp.watch('src/views/*.slm', ['slm-views']);
  gulp.watch('src/sass/**/*.sass', ['sass']);
  gulp.watch('src/images/static/**/*.svg', ['img-static']);
});

// var webpack = require('webpack-stream');
// var slm = require('gulp-slm');
// var fs = require('fs');
// var through = require('through2');
// var slm_compile = require('slm').compile;
// var clean = require('gulp-clean');
//
// var embedHtmlContent = function(layout_path) {
//   return function(chunk, enc, cb) {
//     var content_html = String(chunk.contents);
//     var layout_slm = fs.readFileSync(layout_path, 'utf8');
//     var page_html = slm_compile(layout_slm, null)({
//       content: content_html
//     })
//     chunk.contents = new Buffer(page_html);
//     cb(null, chunk);
//   };
// };
//
// gulp.task('default', ['webpack', 'build-slm'])
// gulp.task('clean', function() {
//   return gulp.src('dist/', {
//       read: false
//     })
//     .pipe(clean())
// });
//
// gulp.task('webpack', function() {
//   return gulp.src('src/entry.js')
//     .pipe(webpack(require('./webpack.config.js')))
//     .pipe(gulp.dest('dist/'));
// });
//
//
// gulp.task('build-slm-index', function() {
//   return gulp.src('src/index.slm')
//     .pipe(slm())
//     .pipe(through.obj(embedHtmlContent('./src/layouts/application.slm')))
//     .pipe(gulp.dest('./dist/'));
// });
//
// gulp.task('build-slm-views', function() {
//   return gulp.src('src/views/*.slm')
//     .pipe(slm())
//     .pipe(through.obj(embedHtmlContent('./src/layouts/application.slm')))
//     .pipe(gulp.dest('./dist/views'));
// });
//
// gulp.task('build-slm-posts', function() {
//   return gulp.src('src/posts/*.slm')
//     .pipe(slm())
//     .pipe(through.obj(embedHtmlContent('./src/layouts/application.slm')))
//     .pipe(gulp.dest('./dist/posts'));
// });
