var gulp = require('gulp')
  , connect = require('gulp-connect')
  , rename = require( 'gulp-rename' )
  , ngmin = require('gulp-ngmin')
  , minifycss = require( 'gulp-minify-css' )
  , minifyHTML = require('gulp-minify-html')
  , notify = require( 'gulp-notify' )
  , uglify = require('gulp-uglify')
  , clean = require('gulp-clean');

var paths = {
    html: ['**/*.html']
  , reloadAll: ['!./public/bower_co*/**', './public/**/{*.html,*.css,*.js}']
  , images: 'client/img/**/*'
};

gulp.task('connect', function() {
  connect.server({
    root: 'public/',
    port: 8082,
    livereload: true
  });
});

gulp.task('reloadAll', function () {
  gulp.src(paths.reloadAll).pipe(connect.reload());
});

gulp.task('cleanbuild', function () {
  gulp.src('./public/build/*', {read: false})
    .pipe(clean({force: true}))
    .pipe(notify({ message: 'Clean build directory complete' }));
});


gulp.task('minify', function() {
  gulp.src('./public/scripts/**/*.js')
    .pipe(ngmin())
    .pipe(gulp.dest('./public/scripts/'))
    .pipe(notify({ message: 'Minify js complete' }));

  gulp.src('./public/css/*.css')
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('./public/build/css/'))
    .pipe( notify({ message: 'Minify css complete' }));

    var opts = {comments:false,spare:true};
    gulp.src('./public/views/*.html')
      .pipe(minifyHTML(opts))
      .pipe(gulp.dest('./public/build/views/'))
      .pipe( notify({ message: 'Minify html complete' }));
});

gulp.task('compress', function() {
  gulp.src('./public/scripts/**/*.js')
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('./public/build/js/'))
});

gulp.task('scripts', function () {
  gulp.src(paths.js[0]).pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(paths.reloadAll, ['reloadAll']);
});

gulp.task('default', ['connect', 'cleanbuild', 'minify', 'compress', 'watch' ]);
