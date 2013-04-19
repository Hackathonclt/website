var docpadConfig;
var __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
docpadConfig = {
  templateData: {
    site: {
      url: "http://hackathonclt.org",
      oldUrls: ['www.hackathonclt.org'],
      title: "Hackathon CLT",
      description: "Charlotte's First Big Data Hackathon.",
      keywords: "Charlotte, Hackathon, Big Data, Hadoop, MongoDB, Software Development"
    },
    getPreparedTitle: function() {
      if (this.document.title) {
        return "" + this.document.title + " | " + this.site.title;
      } else {
        return this.site.title;
      }
    },
    getPreparedDescription: function() {
      return this.document.description || this.site.description;
    },
    getPreparedKeywords: function() {
      return this.site.keywords.concat(this.document.keywords || []).join(', ');
    },
    getGruntedStyles: function() {
      var gruntConfig, styles, _;
      _ = require('underscore');
      styles = [];
      gruntConfig = require('./grunt-config.json');
      _.each(gruntConfig, function(value, key) {
        return styles = styles.concat(_.flatten(_.pluck(value, 'dest')));
      });
      styles = _.filter(styles, function(value) {
        return value.indexOf('.min.css') > -1;
      });
      return _.map(styles, function(value) {
        return value.replace('out', '');
      });
    },
    getGruntedScripts: function() {
      var gruntConfig, scripts, _;
      _ = require('underscore');
      scripts = [];
      gruntConfig = require('./grunt-config.json');
      _.each(gruntConfig, function(value, key) {
        return scripts = scripts.concat(_.flatten(_.pluck(value, 'dest')));
      });
      scripts = _.filter(scripts, function(value) {
        return value.indexOf('.min.js') > -1;
      });
      return _.map(scripts, function(value) {
        return value.replace('out', '');
      });
    }
  },
  events: {
    serverExtend: function(opts) {
      var docpad, latestConfig, newUrl, oldUrls, server;
      server = opts.server;
      docpad = this.docpad;
      latestConfig = docpad.getConfig();
      oldUrls = latestConfig.templateData.site.oldUrls || [];
      newUrl = latestConfig.templateData.site.url;
      return server.use(function(req, res, next) {
        var _ref;
        if (_ref = req.headers.host, __indexOf.call(oldUrls, _ref) >= 0) {
          return res.redirect(newUrl + req.url, 301);
        } else {
          return next();
        }
      });
    },
    writeAfter: function(opts, next) {
      var balUtil, command, docpad, rootPath, _;
      docpad = this.docpad;
      rootPath = docpad.config.rootPath;
      balUtil = require('bal-util');
      _ = require('underscore');
      command = ["" + rootPath + "/node_modules/.bin/grunt", 'default'];
      balUtil.spawn(command, {
        cwd: rootPath,
        output: true
      }, function() {
        var gruntConfig, src;
        src = [];
        gruntConfig = require('./grunt-config.json');
        _.each(gruntConfig, function(value, key) {
          return src = src.concat(_.flatten(_.pluck(value, 'src')));
        });
        _.each(src, function(value) {
          return balUtil.spawn(['rm', value], {
            cwd: rootPath,
            output: false
          }, function() {});
        });
        balUtil.spawn(['find', '.', '-type', 'd', '-empty', '-exec', 'rmdir', '{}', '\;'], {
          cwd: rootPath + '/out',
          output: false
        }, function() {});
        return next();
      });
      return this;
    }
  }
};
module.exports = docpadConfig;