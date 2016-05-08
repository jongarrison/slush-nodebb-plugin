/*
 * Generated using:
 * slush-nodebb-plugin
 * https://github.com/jongarrison/slush-nodebb-plugin
 */
(function() {
  'use strict';

  var winston = module.parent.require('winston');
  var plugins = module.parent.require('./plugins');
  var fs = require('fs');
  var path = require('path');
  var util = require('util');
  var app;

  /*
   files in static/ will be accessible via a path like:
   http://yournodebbinstall.com/plugins/<%= pluginNameShort %>/static/file.html
   */

  var Plugin = {
    staticAppLoad: function(params, callback) {
      winston.verbose("<%= pluginNameShort %> - staticAppLoad called");

      app = params.app;
      var router = params.router;

      <% if (hasAdminPageRoute) { %>
      var renderCustomAdminPage = function (req, res) {
        res.render('<%= adminPageRouteName %>.tpl', {someInjectedData: "<%= pluginNameLong %>"});
      }
      //Why two routes? See: https://github.com/NodeBB/nodebb-plugin-quickstart/blob/master/library.js
      router.get('/admin/<%= adminPageRouteName %>', params.middleware.admin.buildHeader, renderCustomAdminPage);
      router.get('/api/admin/<%= adminPageRouteName %>', renderCustomAdminPage);
      <% } %><% if (hasPageRoute) { %>
      var renderCustomPage = function (req, res) {
        res.render('<%= pageRouteName %>.tpl', {someInjectedData: "<%= pluginNameLong %>"});
      }
      //Why two routes? See: https://github.com/NodeBB/nodebb-plugin-quickstart/blob/master/library.js
      router.get('/<%= pageRouteName %>', params.middleware.buildHeader, renderCustomPage);
      router.get('/api/<%= pageRouteName %>', renderCustomPage);
      <% } %>
      if (typeof callback === 'function') {
        callback();
      }
    }, //staticAppLoad

    <% if (hasWidget) { %>
    defineWidgets: function(widgets, callback) {
      loadWidgetTemplate('./widgets/admin/widget.tpl', function(templateData) {
        widgets = widgets.concat([
          {
            widget: "<%= widgetId %>",
            name: "<%= widgetName %>",
            description: "",
            content: templateData
          }
        ]);
        callback(null, widgets);
      });
    }, //defineWidgets

    render<%= widgetIdCapped %>: function(widget, callback) {
      app.render("widgets/widget.tpl", {dataExample: "Some Test Data", "adminSettingForWidget" : widget.adminSettingForWidget }, callback);
    }, //renderWidgetId
    <% } %><% if (hasHook) { %>
    <%= hookListenerMethod %>: function(data, callback) {
      //Note: You may need to alter the parameters here function(data, callback) appropriate for your hook
      //Things can go very wrong if you implement a hook or call the callback incorrectly
      winston.verbose("<%= pluginNameShort %> - <%= hookName %> called with data: " + util.inspect(data));
      if (typeof callback === 'function') {
        callback();
      }
    },
    <% } %>
  };
  module.exports = Plugin;
  <% if (hasWidget) { %>
  function loadWidgetTemplate(template, next) {
    var __dirname = "./node_modules/<%= pluginNameShort %>";
    fs.readFile(path.resolve(__dirname, template), function (err, data) {
      if (err) {
        console.log(err.message);
        return next(null, err);
      }
      next(data.toString());
    });
  }
  <% } %>
})();
