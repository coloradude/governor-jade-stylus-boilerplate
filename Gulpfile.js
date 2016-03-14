const gulp = require('gulp')
const plumber = require('gulp-plumber')
const browserify = require('gulp-browserify')
const stylus = require('gulp-stylus')
const cssmin = require('gulp-cssmin')
const rename = require('gulp-rename')
const jsmin = require('gulp-jsmin')
const autoprefixer = require('gulp-autoprefixer')
const jade = require('gulp-jade')

gulp.task('js', function(){
  return gulp.src('src/js/app.js', { read: false })
    .pipe(plumber())
    .pipe(browserify())
    .pipe(rename('app.js'))
    .pipe(gulp.dest('dist/js'))
})

gulp.task('css', function(){
  return gulp.src('src/stylus/*.styl')
    .pipe(plumber())
    .pipe(stylus({errors: true, 'include css': true}))
    .pipe(autoprefixer())
    .pipe(gulp.dest('dist/css'))
})

gulp.task('partials', function(){
  return gulp.src('src/templates/layouts/partials/*.jade')
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest('dist/templates/layouts/partials'))
})

gulp.task('pages', function(){
  return gulp.src('src/templates/pages/*.jade')
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest('dist/templates/pages'))
})

gulp.task('layouts', function(){
  return gulp.src('src/templates/layouts/*.jade')
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest('dist/templates/layouts'))
})

gulp.task('build', function(){
  gulp.src('dist/js/app.js')
    .pipe(plumber())
    .pipe(jsmin())
    .pipe(gulp.dest('dist/js'))
  
  gulp.src('dist/css/*.css')
    .pipe(cssmin())
    .pipe(gulp.dest('dist/css'))
})

gulp.task('default', ['js', 'css', 'layouts', 'partials', 'pages'], function(){
  gulp.watch('src/stylus/*.styl', ['css'])
  gulp.watch('src/js/*.js', ['js'])
  gulp.watch('src/templates/layouts/*.jade', ['layouts'])
  gulp.watch('src/templates/layouts/partials/*.jade', ['partials'])
  gulp.watch('src/templates/pages/*.jade', ['pages'])
})














