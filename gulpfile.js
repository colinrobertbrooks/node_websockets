var gulp = require('gulp');
var sass = require('gulp-sass');

var config = {
  bootstrapDir: './bower_components/bootstrap-sass',
  jQueryDir: './bower_components/jquery',
  publicDir: './public',
  srcDir: './src'
};

gulp.task('stylesheets', function() {
  return gulp.src('./css/app.scss')
  .pipe(sass({
    includePaths: [config.bootstrapDir + '/assets/stylesheets'],
  }))
  .pipe(gulp.dest(config.publicDir + '/stylesheets'));
});

gulp.task('fonts', function() {
  return gulp.src(config.bootstrapDir + '/assets/fonts/**/*')
  .pipe(gulp.dest(config.publicDir + '/stylesheets'));
});

gulp.task('javascripts', function() {
  // vendor (TODO: concatenate & uglify)
  gulp.src(config.jQueryDir + '/dist/jquery.js')
    .pipe(gulp.dest(config.publicDir + '/javascripts'));
});

gulp.task('default', ['stylesheets', 'fonts', 'javascripts']);
