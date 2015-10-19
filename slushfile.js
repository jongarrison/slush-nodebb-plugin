/*
 * slush-slush-nodebb-plugin
 * https://github.com/jongarrison/slush-slush-nodebb-plugin
 *
 * Copyright (c) 2015, Jon Garrison
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
    path = require('path'),
    util = require('util');

function format(string) {
  var username = string.toLowerCase();
  return username.replace(/\s/g, '');
}

var defaults = (function () {
  var workingDirName = path.basename(process.cwd()),
      homeDir, osUserName, configFile, user, githubName;

  if (process.platform === 'win32') {
    homeDir = process.env.USERPROFILE;
    osUserName = process.env.USERNAME || path.basename(homeDir).toLowerCase();
  }
  else {
    homeDir = process.env.HOME || process.env.HOMEPATH;
    osUserName = homeDir && homeDir.split('/').pop() || 'root';
  }

  configFile = path.join(homeDir, '.gitconfig');
  user = {};

  if (require('fs').existsSync(configFile)) {
    var gitconfig = require('iniparser').parseSync(configFile);
    user = gitconfig.user;
    var githubSettings = (gitconfig.github || '') ;
    githubName = (githubSettings) ? githubSettings.user : 'username';
  }

  var startingDirPath = process.cwd();

  return {
    appName: workingDirName,
    userName: format(user.name || ''),
    authorName: user.name || '',
    authorEmail: user.email || '',
    'githubName': githubName,
    hookListenerMethod: "handleHookMethod",
    widgetSlug: "mywidgetname",
    'startingDirPath': startingDirPath
  };
})();

function processYesNo(input) {
    return (input == "yes");
}

gulp.task('default', function (done) {
  var prompts = [{
    name: 'pluginNameShort',
    message: 'What is the plugin name aka id?',
    default: defaults.appName
  }, {
    name: 'pluginNameLong',
    message: 'What is the more descriptive plugin name aka title?',
    default: 'Longer Plugin Title'
  }, {
    name: 'pluginDescription',
    message: 'What is the description?'
  }, {
    name: 'pluginVersion',
    message: 'What is the version of your plugin?',
    default: '0.1.0'
  }, {
    name: 'pluginAuthor',
    message: 'What is the author name?',
    default: defaults.authorName
  }, {
    name: 'githubHttpsUrl',
    message: 'What is the github https url?',
    default: "https://github.com/" + defaults.githubName + "/" + defaults.appName + ".git"
  }, {
    name: 'hasTemplatesFolder',
    type: 'list',
    message: 'Do you want to have a template folder for overriding system templates?',
    choices: ['yes', 'no'],
    filter: processYesNo
  }, {
    name: 'hasJavascriptFile',
    type: 'list',
    message: 'Do you want to inject a javascript file into the system with your plugin?',
    choices: ['yes', 'no'],
    filter: processYesNo
  }, {
    name: 'hasCssFile',
    type: 'list',
    message: 'Do you want to inject a css file into the system with your plugin?',
    choices: ['yes', 'no'],
    filter: processYesNo
  }, {
    name: 'hasWidget',
    type: 'list',
    message: 'Do you want to have a widget in your plugin?',
    choices: ['yes', 'no'],
    filter: processYesNo
  }, {
    name: 'widgetName',
    message: 'What is the name of the widget?',
    default: 'My Widget Name',
    when: function(data) {
      return data.hasWidget;
    }
  }, {
    name: 'widgetId',
    message: 'What is the widget id?',
    default: defaults.widgetSlug,
    when: function(data) {
      return data.hasWidget;
    },
    filter: function(input) {
      return _.slugify(input);
    }
  }, {
    name: 'hasHook',
    type: 'list',
    message: 'Would you like listen to a specific hook?',
    choices: ['yes', 'no'],
    filter: processYesNo
  }, {
    name: 'hookName',
    message: 'Name of the specific hook?',
    default: 'action:user.online',
    when: function (data) {
      return data.hasHook;
    }
  }, {
    name: 'hookListenerMethod',
    message: "Name of the hook's handler method?",
    default: defaults.hookListenerMethod,
    when: function (data) {
      return data.hasHook;
    }
  }, {
    name: 'hasAdminPageRoute',
    type: 'list',
    message: 'Would you like to create a custom admin page route?',
    choices: ['yes', 'no'],
    filter: processYesNo
  }, {
    name: 'adminPageRouteName',
    message: 'Name of the custom admin page route?',
    default: '/admin/customadminroute',
    when: function (data) {
      return data.hasAdminPageRoute;
    }
  }, {
    name: 'hasPageRoute',
    type: 'list',
    message: 'Would you like to create a custom (non-admin) page route?',
    choices: ['yes', 'no'],
    filter: processYesNo
  }, {
    name: 'pageRouteName',
    message: 'Name of the page route?',
    default: '/custompageroute',
    when: function (data) {
      return data.hasPageRoute;
    }
  }, {
    type: 'confirm',
    name: 'moveon',
    message: 'Generate the plugin now?'
  }];

  //Ask
  inquirer.prompt(prompts,
      function (answers) {
        if (!answers.moveon) {
          return done();
        }

        //do some processing of the answers
        answers.widgetIdCapped = (!answers.widgetId) ? '' : answers.widgetId[0].toUpperCase() + answers.widgetId.slice(1);
        answers.appNameSlug = _.slugify(answers.appName);

        //console.log("Answers results: " + util.inspect(answers));

        var srcFiles = [];
        srcFiles.push(__dirname + '/templates/*.json');
        srcFiles.push(__dirname + '/templates/*.js');
        srcFiles.push(__dirname + '/templates/*.md');
        srcFiles.push(__dirname + '/templates/.gitignore');

        if (answers.hasTemplatesFolder) {
          srcFiles.push(__dirname + '/templates/templates/**');
        }
        if (answers.hasJavascriptFile) {
          srcFiles.push(__dirname + '/templates/static/plugin-script.js');
        }
        if (answers.hasCssFile) {
          srcFiles.push(__dirname + '/templates/static/plugin-style.less');
        }
        if (answers.hasWidget) {
          srcFiles.push(__dirname + '/templates/widgets/**');
        }
        if (answers.hasAdminPageRoute) {
          srcFiles.push(__dirname + '/templates/templates/plugin-templates/custom-admin-page.tpl');
        }
        if (answers.hasPageRoute) {
          srcFiles.push(__dirname + '/templates/templates/plugin-templates/custom-page.tpl');
        }

        console.log("starting dir: " + defaults.startingDirPath);

        gulp.src(srcFiles, {base: __dirname + '/templates'})
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
              console.log("starting dir: " + defaults.startingDirPath);
              done();
            });
      });
});


/*
Sample json from the prompts:

  {
   pluginNameShort: 'nodebb-plugin-zipper',
   pluginNameLong: 'Longer Plugin Title',
   pluginDescription: 'Descr',
   pluginVersion: '0.1.0',
   pluginAuthor: 'Jon Garrison',
   githubHttpsUrl: 'https://github.com/jongarrison/nodebb-plugin-zipper.git',
   hasTemplatesFolder: true,
   hasJavascriptFile: true,
   hasCssFile: true,
   hasWidget: true,
   widgetName: 'My Widget Name',
   widgetId: 'mywidgetname',
   hasHook: true,
   hookName: 'filter:post.get',
   hookListenerMethod: 'handleHookMethod',
   hasAdminPageRoute: true,
   adminPageRouteName: '/admin/customadminroute',
   hasPageRoute: true,
   pageRouteName: '/custompageroute',
   moveon: true,
   widgetIdCapped: 'Mywidgetname'
   }

 */