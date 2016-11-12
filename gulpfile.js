var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del'); // rm -rf
var cleanCSS = require('gulp-clean-css');
var browser = require('browser-sync').create();
var historyApiFallback = require('connect-history-api-fallback');

var port = process.env.SERVER_PORT || 3000;

var jsFiles = [
  'app/app.js',
  'app/services/**/*.js',
  'app/controllers/**/*.js',
  'app/assets/**/*.js',
];
var cssFiles = ['app/assets/**/*.css'];
var htmlFiles = ['app/**/*.html'];

// remove build directory
gulp.task('clean', function() {
  return del(['app/build']);
});

gulp.task('minify-js', ['clean'], function() {
  var stream = gulp.src(jsFiles)
    .pipe(concat('trans.js'))
    .pipe(gulp.dest('app/build'))
    .pipe(rename('trans.min.js'))
    .pipe(uglify())
    .on('error', function(error) {
      console.log(error);
    })
    .pipe(gulp.dest('app/build'));
  return stream;
});

// not much of custom css to minify, but worth
// having available just in case 
gulp.task('minify-css', function() {
  var stream = gulp.src(['app/assets/css/*.css'])
    .pipe(concat('app.css'))
    .pipe(gulp.dest('app/build'))
    .pipe(rename('app.min.css'))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('app/build'));
  return stream;
})

// server and run in browser
gulp.task('serve', ['minify-js', 'minify-css'], function() {
  browser.init({
    server: 'app/',
    port: port,
    // rewrites urls to support clean URLs without the '#/'s
    middleware: [historyApiFallback()]
  });
  // watch and rebuild scripts
  gulp.watch(jsFiles, ['minify-js'])
    .on('change', browser.reload);
  gulp.watch(cssFiles, ['minify-css'])
    .on('change', browser.reload);
  gulp.watch(htmlFiles)
    .on('change', browser.reload);
});

gulp.task('default', ['serve']);
