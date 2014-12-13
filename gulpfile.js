/// <vs BeforeBuild='jshint' AfterBuild='deploy' />
var gulp = require('gulp');

// JS hint task
var jshint = require('gulp-jshint');
gulp.task('jshint', function() {
  gulp.src('./*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//deploy to the device
var scp = require('gulp-scp2');
gulp.task('deploy', function () {
    return gulp.src(['*.{js,json}', '!gulpfile.js'])
        .pipe(scp({
            host: 'eddie.local',
            username: 'root',
            password: '12345678',
            dest: 'rattoast'
        }))
        .on('error', function (err) {
            console.log('ERR: ' + err);
        });
});


