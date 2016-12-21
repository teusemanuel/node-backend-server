"use strict";

var gulp = require('gulp'),
    filter = require('gulp-filter'),
    ts = require('gulp-typescript'),
    fs = require('fs');


// TASKS
/////////////
const tsProject = ts.createProject("tsconfig.json");
var paths = {
    pages: ['views/**/*.jade'],
    src: ['src/**/*.ts'],
    all: ['src/**/*.ts', 'views/**/*.jade']
};

gulp.task("default", ['compile', 'copy-jades'], function() {
});

gulp.task("copy-jades", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist/views"));
});

gulp.task('compile', function() {
    const tsFilter = filter('**/*.ts', {restore: true});
    return gulp.src(paths.src, { base: 'src' })
        .pipe(tsFilter)
        .pipe(tsProject())
        .pipe(tsFilter.restore)
        .pipe(gulp.dest("dist"));
});

gulp.task('watch', function() {
    gulp.watch(paths.all, ['compile', 'copy-jades']);
});