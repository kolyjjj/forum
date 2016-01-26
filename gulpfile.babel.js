'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';


gulp.task('build',  () => {
  return gulp.src(['app.js', 'src/**/*.js'])
        .pipe(babel({
         presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
    });
