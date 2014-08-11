var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    mochaPhantomJS = require('gulp-mocha-phantomjs'),
    path = require('path'),
    fs=require('fs');

var TESTS_PATH = './test/';
var specWriter = function (typeOfTest) {
    var template = []; 
    fs.readdir(path.join(TESTS_PATH, typeOfTest) , function (err, files) {
        for (var i = 0; i < files.length; i++) {
            template.push('require("./' + typeOfTest + '/');
            template.push(files[i].replace('.js', ''));
            template.push('");\r\n');
        };
        var specs = template.join('');
        fs.writeFile(TESTS_PATH + typeOfTest + '_specs.js', specs, function (err) {
             
        });
    });
};

gulp.task('unit-specs', function () {
    specWriter('unit');

});
gulp.task('node-test', ['unit-specs'], function () {
    gulp.src('/test/unit_specs.js')
        .pipe(mocha({reporter: 'spec'}))
        .on('error', function (err) {
            console.log(err.toString());
            this.emit('end');
        });
});

gulp.task('dom-test', ['package'], function () {
  return gulp
  .src('./runners/test-runner.html')
  .pipe(mochaPhantomJS({reporter: 'spec'}));
});


gulp.task('slow-dom-test', ['dom-test', 'package'], function () {
  return gulp
  .src('./runners/slow-dom-test-runner.html')
  .pipe(mochaPhantomJS({reporter: 'spec'}));
});

gulp.task('package', function () {
    //do anything required to package scripts for the browser
});

gulp.task('test', ['node-test','slow-dom-test']);
