var gulp = require('gulp')
  , connect = require('gulp-connect')
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

gulp.task('scripts', function () {
  gulp.src(paths.js[0]).pipe(connect.reload());
});

gulp.task('clean', function () {
   gulp.src('tmp', {read: false}).pipe(clean());
});

gulp.task('watch', function () {
  gulp.watch(paths.reloadAll, ['reloadAll']);
});

gulp.task('default', ['connect', 'watch' ]);
