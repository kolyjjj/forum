'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import nodemon from 'gulp-nodemon';
import Cache from 'gulp-file-cache';

const cache = new Cache();


gulp.task('compile',  () => {
  return gulp.src(['app.js', 'src/**/*.js'])
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
