'use strict';
// var rating = require('rating');
var fs = require('fs');
var request = require('request');
var slugify = require('slugify');
var loopback = require('loopback');


module.exports = function(Post) {
  var i, ratingsList;
  var array = [];

  var app = require('../../server/server');
/*
  // Make sure emailVerified is not set by creation
  Post.beforeRemote('create', function(ctx, post, next) {
    var body = ctx.req.body;
    body.datepublication = Date.now();
    body.category = 'todo';

    next();
  });

  Post.getPostRatings = function(id, cb) {
    // var filter = { include : [ 'DETAILS'] };
    // get posts
    Post.find({
      order: 'datepublication DESC',
    }, function(err, posts) {
      if (err) {
        console.log(err);
      } else {
        // get the Generics
        // var Rapp =  Post.app;
        console.log('posts list ', posts.length);

        posts.forEach(function(post) {
          post.rating = [];
        });
        var GenericModel = app.models.rating;

        GenericModel.find(function(err, ratings) {
          if (err) {
            console.log(err);
          } else {
            for (var r = 0; r < ratings.length; r++) {
              for (var l = 0; l < posts.length; l++) {
                if ('' + ratings[r].postId == '' + posts[l].id) {
                  // console.log("r ",ratings[r].postId);

                  array.push(ratings[r]);
                  posts[l].rating.push(ratings[r]);
                } else if ('' + ratings[r].postId != '' + posts[l].id) {
                  array.pop(ratings[r]);
                }
              }
            }
            // console.log("ratings list")
            cb(null, posts);
          }
        });
      }
    });
  };

  Post.remoteMethod('getPostRatings', {
    accepts: [{
      arg: 'id',
      type: 'string',
    }],
    returns: {
      arg: 'Posts',
      type: 'object',
    },
    http: {
      path: '/withRatings',
      verb: 'get',
    },
  });

  Post.getPostRatingsDesc = function(id, cb) {
    // var filter = { include : [ 'DETAILS'] };
    // get posts
    Post.find({
      order: 'rating DESC',
    }, function(err, posts) {
      if (err) {
        console.log(err);
      } else {
        // get the Generics
        // var Rapp =  Post.app;
        console.log('posts list ', posts.length);

        posts.forEach(function(post) {
          post.rating = [];
        });
        var GenericModel = app.models.rating;

        GenericModel.find(function(err, ratings) {
          if (err) {
            console.log(err);
          } else {
            for (var r = 0; r < ratings.length; r++) {
              for (var l = 0; l < posts.length; l++) {
                if ('' + ratings[r].postId == '' + posts[l].id) {
                  // console.log("r ",ratings[r].postId);

                  array.push(ratings[r]);
                  posts[l].rating.push(ratings[r]);
                } else if ('' + ratings[r].postId != '' + posts[l].id) {
                  array.pop(ratings[r]);
                }
              }
            }
            // console.log("ratings list")
            cb(null, posts);
          }
        });
      }
    });
  };

  Post.remoteMethod('getPostRatingsDesc', {
    accepts: [{
      arg: 'id',
      type: 'string',
    }],
    returns: {
      arg: 'Posts',
      type: 'object',
    },
    http: {
      path: '/withRatingsDesc',
      verb: 'get',
    },
  });
*/

  // Register an 'upvote' remote method: /posts/some-id/upvote
  Post.remoteMethod(
    'upvote',
    {
      http: {path: '/:id/upvote', verb: 'post'},
      accepts: [{arg: 'id', type: 'string', required: true, http: { source: 'path' }},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'}],
      returns: {root: true, type: 'object'},
      description: 'Marks a Post as upvoted.'
    }
  );

  // Remote hook called before running function
  Post.beforeRemote('upvote', function(ctx, user, next) {
    Post.findById(ctx.req.params.id, function(err, record) {
      // do not let the user upvote their own record
      console.log(typeof ctx.req.accessToken.userId);
      console.log("index of ",typeof record.upvotes);
      if (record.userId === ctx.req.accessToken.userId) {
        var err = new Error('User cannot upvote their own post.');
        err.status = 403;
        next(err);
      // do no let the user upvote a comment more than once
      } else if (record.upvotes.indexOf(ctx.req.accessToken.userId)) {
        var err = new Error("User has already upvoted the Post.");
        err.status = 403;
        next(err);
      } else {
        next();
      }
    })
  });

  // the actual function called by the route to do the work
  Post.upvote = function(id,options, cb) {
    // get the current context
    //var ctx = loopback.getCurrentContext();
    Post.findById(id, function(err, record){
      // get the calling user who 'upvoted' it from the context
      record.upvotes.push(options.accessToken.userId);
      record.updateAttributes({numOfUpVotes: record.upvotes.length, upvotes: record.upvotes}, function(err, instance) {
        if (err) cb(err);
        if (!err) cb(null, instance);
      })
    })
  };
  // UPVOTE

  // Register a 'downvote' remote method: /posts/some-id/downvote
  // Note: essentially the same code as upvote
  Post.remoteMethod(
    'downvote',
    {
      http: {path: '/:id/downvote', verb: 'post'},
      accepts: [{arg: 'id', type: 'string', required: true, http: { source: 'path' }},
      
      {arg: 'options', type: 'object', http: 'optionsFromRequest'}],
      returns: {root: true, type: 'object'},
      description: 'Marks a Post as downvoted.'
    }
  );

  // Remote hook called before running function
  Post.beforeRemote('downvote', function(ctx, user, next) {
    Post.findById(ctx.req.params.id, function(err, record){
      // do not let the user downvote their own record
      if (record.authorId === ctx.req.accessToken.userId) {
        var err = new Error("User cannot downvote their own post.");
        err.status = 403;
        next(err);
      // do no let the user downvote a comment more than once
      } else if (record.downvotes.indexOf(ctx.req.accessToken.userId) != -1) {
        var err = new Error("User has already downvoted the Post.");
        err.status = 403;
        next(err);
      } else {
        next();
      }
    })
  });

  // the actual function called by the route to do the work
  Post.downvote = function(id,options, cb) {
    // get the current context
    Post.findById(id, function(err, record){
      // get the calling user who 'downvoted' it from the context
      record.downvotes.push(options.accessToken.userId);
      record.updateAttributes({numOfDownVotes: record.downvotes.length, downvote: record.downvotes}, function(err, instance) {
        if (err) cb(err);
        if (!err) cb(null, instance);
      })
    })
  };
  // DOWNVOTE

  // Call an operation hook that runs before each record is saved
  Post.observe('before save', function filterProperties(ctx, next) {
    // TODO ensure the slug is unique per user
    // If there is a record in the context
    if (ctx.instance) {
      // slugify the title
      if (ctx.instance.slug === undefined) {
        ctx.instance.slug = slugify(ctx.instance.title).toLowerCase();
      }
      // Ensure a valid datepublication
      if (ctx.instance.datepublication === undefined) {
        ctx.instance.datepublication = new Date();
      }
      // Category is still not implemented in the client
      if(ctx.instance.category === undefined) ctx.instance.category = "TODO";
      // Ensure the lines, dislikes and tags are an empty array
      if (ctx.instance.upvotes === undefined) ctx.instance.upvotes = [];
      if (ctx.instance.downvotes === undefined) ctx.instance.downvotes = [];
      if (ctx.instance.tags === undefined) ctx.instance.tags = [];
    }
    next();
  });
  /// ////////////////

  Post.senNotif = function(id, title, msg, cb) {
    var url = 'https://fcm.googleapis.com/fcm/send';

    var serverKey = 'AAAAZqyMyrw:APA91bGSjh35Vub6_pD0XERvUmuCp4JhcPa8wINY4neFCUDfkvP64e2fLVV-c Vyo_HRn6EcIDiA2xpAv2C_b8bSao3JytgWyyPp2fnR2qQcNf7BEGUxeG_eHlqq1F3v9A4SY5qudz9CN';

    var token = '/topics/' + id;
    var notification = {
      'title': title,
      'text': msg,
      'sound': 'default',
      'badge': '1',
    };
    var arraytosend = {
      'to': token,
      'notification': notification,
      'priority': 'high',
    };
    // var headers = {'Content-Type: application/json','Authorization: key='+serverKey};
    request.post({
      url: url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key=' + serverKey,
      },
      json: arraytosend,
    }, function(err, response) {
      if (err) console.error(err);

      console.log('notif response', response.send);
      cb(null, response);
    });
  };

  Post.remoteMethod('senNotif', {
    accepts: [{
      arg: 'id',
      type: 'string',
    }, {
      arg: 'msg',
      type: 'string',
    }, {
      arg: 'title',
      type: 'string',
    }],
    returns: {
      arg: 'Response',
      type: 'object',
    },
    http: {
      path: '/senNotif',
      verb: 'post',
    },
  });

  /// //////////////

  function decodeImg(imgEncoded) {
    var img = imgEncoded;
    var d = new Date().valueOf();
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    if ('jpeg' == img.split(';')[0].split('/')[1]) {
      var imageName = d + '.' + text + '.jpg';
    }
    if ('gif' == img.split(';')[0].split('/')[1]) {
      var imageName = d + '.' + text + '.gif';
    }
    if ('x-icon' == img.split(';')[0].split('/')[1]) {
      var imageName = d + '.' + text + '.ico';
    }
    if ('png' == img.split(';')[0].split('/')[1]) {
      var imageName = d + '.' + text + '.png';
    }
    var data = img.replace(/^data:image\/\w+;base64,/, '');

    var buf = new Buffer(data, 'base64');

    var path = 'http://localhost/img/';

    // res.send(imageName);

    return imageName;
  }
};
