var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var styl = require('gulp-styl');
var inline = require('rework-inline');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');


gulp.task('styl', function () {
    return gulp.src('src/css/app.styl')
        .pipe(styl(inline()))
        .pipe(rename(function(path) {
          path.basename = "bundle"
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('styl-watch', function() {
  var watcher = gulp.watch('src/css/*.*', ['styl']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
})

var bundler = watchify(browserify('./src/js/app.js', watchify.args));
// add any other browserify options or transforms here
bundler.transform('reactify');
bundler.transform('envify');

gulp.task('js', bundle); // so you can run `gulp js` to build the file
bundler.on('update', bundle); // on any dep update, runs the bundler

function bundle() {
  return bundler.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you dont want sourcemaps
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
      .pipe(sourcemaps.write('./')) // writes .map file
    //
    .pipe(gulp.dest('./build'));
}


var browserifyConfig = {
  entries: ['./src/js/app.js'],
  debug: true
};

gulp.task('serve', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});

gulp.task('start', ['styl-watch', 'js', 'serve']);


gulp.task('dist', ['styl'], function() {
  // TODO: debug = false
  var bundle = function() {
    return bundler
      .bundle()
      .pipe(source('bundle.min.js'))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest('./build'));
  };

  return bundle();
});