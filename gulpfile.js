"use strict"

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
var sass        = require('gulp-sass');
var browserSync = require('browser-sync');

// delay browser reloading after nodemon start
var BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({

    // nodemon our expressjs server
    script: 'app.js',

    // watch core server file(s) that require server restart on change
    watch: ['app.js']
  })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) { cb(); }
      called = true;
    })
    .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});

gulp.task('browser-sync', ['nodemon'], function () {

  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync({

    // informs browser-sync to proxy our expressjs app which would run at the following location
    proxy: 'http://localhost:3000',

    // informs browser-sync to use the following port for the proxied app
    // notice that the default port is 3000, which would clash with our expressjs
    port: 4000,
  });
});

// gulp.task('js-root',  function () {
//   return gulp.src('*.js')
//     // do stuff to JavaScript files
//     //.pipe(uglify())
//     //.pipe(gulp.dest('...'));
// });

gulp.task('js-public',  function () {
  return gulp.src('public/**/*.js')
});

gulp.task('js-routes',  function () {
  return gulp.src('routes/*.js')
});

gulp.task('ejs-views',  function () {
  return gulp.src('views/*.ejs')
});

gulp.task('ejs-views-partials',  function () {
  return gulp.src('views/**/*.ejs')
});

gulp.task('sass',  function () {
  return gulp.src('public/stylesheets/*.sass')
});

gulp.task('css', function () {
  return gulp.src('public/stylesheets/*.css')
    .pipe(browserSync.reload({ stream: true }));
})

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('default', ['browser-sync'], function () {
  //gulp.watch("*.js", ['js-root', browserSync.reload]);
  gulp.watch("public/**/*.js",   ['js-public', browserSync.reload]);
  gulp.watch("public/stylesheets/*.css",  ['css']);
  gulp.watch("public/**/*.html", ['bs-reload']);
  gulp.watch("public/stylesheets/*.sass", ['sass']);
  gulp.watch("routes/*.js", ['js-routes', browserSync.reload]);
  gulp.watch("views/*.ejs", ['ejs-views', browserSync.reload]);
  gulp.watch("views/**/*.ejs", ['ejs-views-partials', browserSync.reload]);
});