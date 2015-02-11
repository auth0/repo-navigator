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
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var through = require('through2');
var AWS = require('aws-sdk');
var path = require('path');

AWS.config.update({
  accessKeyId:  process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET
});

awsBucket = process.env.S3_BUCKET;

gulp.task('clean', function() {
  return gulp.src('build')
    .pipe(clean());
});

gulp.task('css', ['clean'], function () {
  return gulp.src('src/css/app.styl')
    .pipe(styl(inline()))
    .pipe(rename(function(path) {
      path.basename = "bundle"
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('css-watch', function() {
  var watcher = gulp.watch('src/css/*.*', ['styl']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});

gulp.task('css-minify', ['css'], function() {
  return gulp.src('./build/bundle.css')
    .pipe(minifyCSS())
    .pipe(rename(function(path) {
      path.extname = '.min.css';
    }))
    .pipe(gulp.dest('./build'))
});

function scripts(production, watch) {
  var bundler, rebundle;
  bundler = browserify('./src/js/app.js', {
    basedir: __dirname,
    debug: !production,
    cache: {}, // required for watchify
    packageCache: {}, // required for watchify
    fullPaths: watch // required to be true only for watchify
  });
  if(watch) {
    bundler = watchify(bundler)
  }

  bundler.transform('reactify');
  bundler.transform('envify');

  rebundle = function() {
    var stream = bundler.bundle();
    stream.on('error', function() { console.log('Browserify error') });
    stream = stream.pipe(source('bundle.js'));
    return stream.pipe(gulp.dest('./build'));
  };

  //bundler.on('update', rebundle);
  return rebundle();
}

gulp.task('js-watch', scripts.bind(null, false, true));
gulp.task('js', ['clean'], scripts.bind(null, true, false));
gulp.task('js-minify', ['js'], function() {
  return gulp.src('./build/bundle.js')
    .pipe(uglify())
    .pipe(rename(function(path) {
      path.extname = '.min.js'
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('serve', function() {
  return gulp.src('./')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});

gulp.task('cdn', ['package'], function() {

  var getContentType = function(filename) {
    var ext = path.extname(filename);
    switch (ext) {
      case '.js':
        return 'application/javascript';
      case '.css':
        return 'text/css';
      default:
        throw 'Unknown file type';
    }
  };

  var upload = function() {
    var s3bucket = new AWS.S3({params: { Bucket: awsBucket }});
    var stream = through.obj(function(file, enc, cb) {

      var self = this;
      var params = {
        Key: file.relative,
        Body: file.contents,
        ContentType: getContentType(file.relative),
        CacheControl: 'public, max-age=300',
        ACL: 'public-read'
      };
      s3bucket.upload(params, function(err, data) {
        if (err) {
          console.log("Error uploading data: ", err);
        }
        self.push(file);
        cb();
      });
    });
    return stream;
  };


  return gulp.src('./build/*.*')
    .pipe(upload())
    .pipe(rename(function(path) {
      if (path.basename.indexOf('.min') > 0) {
        path.basename = 'latest.min'
      } else {
        path.basename = 'latest'
      }

    }))
    .pipe(upload());
});


gulp.task('start', ['css-watch', 'js-watch', 'serve']);
gulp.task('package', ['css-minify', 'js-minify']);
