/*
 * slush-test
 * https://github.com/kevnz/slush-test
 *
 * Copyright (c) 2014, Kevin Isom
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _ = require('underscore.string'),
    inquirer = require('inquirer'),
    args = require('yargs').argv;


gulp.task('unit', function (done) {
    var testName = args.name;
    gulp.src(__dirname + '/sub-templates/unit/**')
    .pipe(template({}))
    .pipe(rename(function (file) {
        if(file.basename) file.basename = testName + '_spec';
    }))
    .pipe(gulp.dest('./test/unit'))
    done();
});
function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
}
var defaults = (function () {
    var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
        workingDirName = process.cwd().split('/').pop().split('\\').pop(),
        osUserName = homeDir && homeDir.split('/').pop() || 'root',
        configFile = homeDir + '/.gitconfig',
        user = {};
    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }
    return {
        appName: workingDirName,
        userName: format(user.name) || osUserName,
        authorEmail: user.email || ''
    };
})();
gulp.task('default', function (done) {
    var prompts = [{
        name: 'appName',
        message: 'What is the name of your app you want to test?',
        default: defaults.appName
    }, {
        name: 'appDescription',
        message: 'What is the description?'
    }, {
        name: 'appVersion',
        message: 'What is the version of your app?',
        default: '0.1.0'
    }, {
        name: 'authorName',
        message: 'What is the author name?',
    }, {
        name: 'authorEmail',
        message: 'What is the author email?',
        default: defaults.authorEmail
    }, {
        name: 'userName',
        message: 'What is the github username?',
        default: defaults.userName
    }, {
        type: 'list',
        name: 'license',
        message: 'Choose your license type',
        choices: ['MIT', 'BSD', 'Unlicense', 'Commercial'],
        default: 'MIT'
    }, {
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?'
    }];
    //Ask
    inquirer.prompt(prompts,
        function (answers) {
            if (!answers.moveon) {
                return done();
            }
            answers.appNameSlug = _.slugify(answers.appName);
            gulp.src(__dirname + '/templates/**')
                .pipe(template(answers))
                .pipe(rename(function (file) {
                    if (file.basename[0] === '_') {
                        file.basename = '.' + file.basename.slice(1);
                    }
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .pipe(install())
                .on('end', function () {
                    done();
                });
        });
});
