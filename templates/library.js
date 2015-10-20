/*
 * Generated using:
 * slush-nodebb-plugin
 * https://github.com/jongarrison/slush-nodebb-plugin
 */
(function() {
  'use strict';

  var winston = module.parent.require('winston'),
      plugins = module.parent.require('./plugins'),
      fs = require('fs'),
      path = require('path'),
      util = require('util'),
      app;

  var Plugin = {
    staticAppLoad: function(params, callback) {
      winston.verbose("<%= pluginNameShort %> - staticAppLoad called");

      app = params.app;
      var router = params.router;

      <% if (hasAdminPageRoute) { %>
      var renderCustomAdminPage = function (req, res) {
        res.render('plugin-templates/custom-admin-page.tpl', {someInjectedData: "<%= pluginNameLong %>"});
      }
      router.get('<%= adminPageRouteName %>', params.middleware.admin.buildHeader, renderCustomAdminPage);
      <% } %><% if (hasPageRoute) { %>
      var renderCustomPage = function (req, res) {
        res.render('plugin-templates/custom-page.tpl', {someInjectedData: "<%= pluginNameLong %>"});
      }
      router.get('<%= pageRouteName %>', params.middleware.buildHeader, renderCustomPage);
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
