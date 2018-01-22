'use strict';
var express = require('express');
var path = require('path');
var loopback = require('loopback');
var boot = require('loopback-boot');
//exports.apnsTokenKeyPath = './server/private/notification/apns.p8';
//exports.apnsTokenKeyId = 'xxxxxxxx';
//exports.apnsTokenTeamId = 'xxxxxxxx';
//exports.apnsBundleId = 'esprit.goga.Goga1';

var app = module.exports = loopback();
var path = require('path');

app.use(express.static(path.resolve('./public')));



app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
