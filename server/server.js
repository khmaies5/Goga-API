'use strict';
var express = require('express');
var path = require('path');
var loopback = require('loopback');
var boot = require('loopback-boot');
var app = module.exports = loopback();
app.use(express.static(path.resolve('./public')));
//app.use(loopback.context());
app.use(loopback.token());


app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('host '+app.set('host','goga-api.herokuapp.com'));
    console.log('host '+app.get('host'));

    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

//app.listen(process.env.PORT || 3000)

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

