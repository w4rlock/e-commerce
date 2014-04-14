var gulp = require('gulp')
  , connect = require('gulp-connect')
  , pathreload = ['./public/*'];

gulp.task('connect', function() {
  connect.server({
    root: 'public/',
    port: 8082,
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src(pathreload[0])
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch([pathreload[0]], ['html']);
});

gulp.task('default', ['connect', 'watch']);
