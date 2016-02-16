'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import nodemon from 'gulp-nodemon';
import Cache from 'gulp-file-cache';
import minimist from 'minimist';
import mocha from 'gulp-mocha';

const cache = new Cache();
const knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'local' }
};

const options = minimist(process.argv.slice(2), knownOptions);
const environmentPath = `env/${options.env}/*.js`;

gulp.task('env', () => {
  return gulp.src(environmentPath)
  .pipe(cache.filter())
  .pipe(babel())
  .pipe(cache.cache())
  .pipe(gulp.dest('dist/env'));
});

gulp.task('compile', ['env'], () => {

  return gulp.src(['app.js', 'src/**/*.js'], {base: '.'})
  .pipe(cache.filter())
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(cache.cache())
  .pipe(gulp.dest('dist'));
});

gulp.task('start', ['compile'], () => {
  return nodemon({
    script: 'dist/app.js',
    watch: ['src/**/*.js', 'app.js'],
    tasks: ['compile']
  });
});

gulp.task('testCompile', ()=>{
  return gulp.src(['app.js', 'src/**/*.js', 'test/**/*.js'], {base: '.'})
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest('tmp'));
});

gulp.task('test', ['testCompile'], () => {
  return gulp.src('tmp/test/**/*.spec.js', {read:false})
  // gulp-mocha needs filepaths so you can't have any plugins before it
  .pipe(mocha({reporter:'nyan'}));
})
