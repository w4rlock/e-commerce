var gulp = require('gulp')
  , connect = require('gulp-connect')
  , ngmin = require('gulp-ngmin')
  , rename = require( 'gulp-rename' )
  , minifycss = require( 'gulp-minify-css' )
  , notify = require( 'gulp-notify' )
  , uglify = require('gulp-uglify');

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


gulp.task('minify', function() {
  gulp.src('./public/scripts/**/*.js')
    .pipe(ngmin())
    .pipe(gulp.dest('./public/scripts/'))
    .pipe(notify({ message: 'Minify js task complete' }));

  gulp.src('./public/css/*.css')
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('./public/css/'))
    .pipe( notify({ message: 'Minify css task complete' }));
});

gulp.task('compress', function() {
  gulp.src('./public/scripts/**/*.js')
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('./public/build/'))
  //});

  //gulp.src('public/scripts/app.js')
    //.pipe(ngmin())
    //.pipe(gulp.dest('public/assets/'))
});

gulp.task('scripts', function () {
  gulp.src(paths.js[0]).pipe(connect.reload());
});

gulp.task('clean', function () {
   gulp.src('tmp', {read: false}).pipe(clean());
});

gulp.task('watch', function () {
  gulp.watch(paths.reloadAll, ['reloadAll']);
});

gulp.task('default', ['connect', 'minify', 'compress', 'watch' ]);
