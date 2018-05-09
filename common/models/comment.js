'use strict';

module.exports = function(Comment) {

    Comment.disableRemoteMethodByName('deleteById');


     // Register a 'like' remote method: /comments/some-id/like
  Comment.remoteMethod(
    'like',
    {
      http: {path: '/:id/like', verb: 'post'},
      accepts: [{arg: 'id', type: 'string', required: true, http: { source: 'path' }},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'}],
      returns: {root: true, type: 'object'},
      description: 'Marks a comment as liked.'
    }
  );

      // Register a 'find_post_comments' remote method: /comments/some-id/like
      Comment.remoteMethod(
        'find_post_comments',
        {
          http: {path: '/:postId/find_post_comments', verb: 'get'},
          accepts: [{arg: 'postId', type: 'string', required: true, http: { source: 'path' }},
          {arg: 'options', type: 'object', http: 'optionsFromRequest'}],
          returns: {root: true, type: 'object'},
          description: 'get all the comments of the postId.'
        }
      );

        // the actual function called by the route to do the work
  Comment.find_post_comments = function(postId, options, cb) {
    Comment.find({where: {postId: postId},include: 'user'}, function(err, record){
      
      console.log(record)
      if(err) cb(err)
      if(!err) cb(null,record)
     
    })
  };

  Comment.afterRemote('find', async function(ctx,next){

     let c = await  Comment.find({include: 'user'}) 
     ctx.result = c;
    console.log(ctx.result);
  })

  Comment.afterRemote('findById',async function(ctx,next){

      let c = await Comment.findById(ctx.req.params.id,{include: 'user'})
      console.log(c)
      console.log(ctx.req.id)
  })

  // Remote hook called before running function
  Comment.beforeRemote('like', function(ctx, user, next) {
    Comment.findById(ctx.req.params.id, function(err, record){
      // do not let the user like their own record
      if (record.userId === ctx.req.accessToken.userId) {
        var err = new Error("User cannot like their own comment.");
        err.status = 403;
        next(err);
      // do no let the user like a comment more than once
      } else if (record.likes.length > 0 && record.likes.indexOf(ctx.req.accessToken.userId) != -1) {
        var err = new Error("User has already liked the comment.");
        err.status = 403;
        next(err);
      } else {
        next();
      }
    })
  });

  // the actual function called by the route to do the work
  Comment.like = function(id, options, cb) {
    Comment.findById(id, function(err, record){
      // get the calling user who 'liked' it from the context
      console.log("dislike array "+record.dislikes)
      console.log("index of dislikes "+record.dislikes.indexOf(options.accessToken.userId))
      if (record.dislikes == undefined || record.dislikes.indexOf(options.accessToken.userId) == -1){
      record.likes.push(options.accessToken.userId);
      record.updateAttributes({numberOfLikes: record.likes.length, likes: record.likes}, function(err, instance) {
        if (err) cb(err);
        if (!err) cb(null, instance);
      })
    }else{
      record.likes.push(options.accessToken.userId);
      record.dislike.pop(options.accessToken.userId);
      record.updateAttributes({numberOfLikes: record.likes.length, likes: record.likes,numberOfDislikes: record.dislikes.length, dislikes: record.dislikes}, function(err, instance) {
        if (err) cb(err);
        if (!err) cb(null, instance);
      })
    }
    })
  };
  // LIKE

  // Register a 'dislike' remote method: /blogs/some-id/dislike
  Comment.remoteMethod(
    'dislike',
    {
      http: {path: '/:id/dislike', verb: 'post'},
      accepts: [{arg: 'id', type: 'string', required: true, http: { source: 'path' }},
      {arg: 'options', type: 'object', http: 'optionsFromRequest'}],
      returns: {root: true, type: 'object'},
      description: 'Marks a comment as disliked.'
    }
  );

  // Remote hook called before running function
  Comment.beforeRemote('dislike', function(ctx, user, next) {
    Comment.findById(ctx.req.params.id, function(err, record){
      // do not let the user dislike their own record
      if (record.userId === ctx.req.accessToken.userId) {
        var err = new Error("User cannot dislike their own comment.");
        err.status = 403;
        next(err);
      // do no let the user dislike a comment more than once
      } else if (record.dislikes.length > 0 && record.dislikes.indexOf(ctx.req.accessToken.userId) != -1) {
        var err = new Error("User has already disliked the comment.");
        err.status = 403;
        next(err);
      } else {
        next();
      }
    })
  });

  // the actual function called by the route to do the work
  Comment.dislike = function(id, options, cb) {
    // get the current context
   
    Comment.findById(id, function(err, record){
      // get the calling user who 'disliked' it from the context
      if (record.likes == undefined || record.likes.indexOf(options.accessToken.userId) == -1){
      record.dislikes.push(options.accessToken.userId);
      record.updateAttributes({numberOfDislikes: record.dislikes.length, dislikes: record.dislikes}, function(err, instance) {
        if (err) cb(err);
        if (!err) cb(null, instance);
      })
    }else{
      record.dislikes.push(options.accessToken.userId);
      record.likes.pop(options.accessToken.userId);
      record.updateAttributes({numberOfDislikes: record.dislikes.length, dislikes: record.dislikes,numberOfLikes: record.likes.length, likes: record.likes}, function(err, instance) {
        if (err) cb(err);
        if (!err) cb(null, instance);
      })
    }
    })
  };
  // DISLIKE

  // Call an operation hook that runs before each record is saved
  Comment.observe('before save', function filterProperties(ctx, next) {
    // If there is a record in the context
    if (ctx.instance) {
      // Ensure a valid postedDate
      if (ctx.instance.createdDate === undefined) {
        ctx.instance.createdDate = new Date();
      }
      console.log("user id ",ctx.options.userId)
      // Ensure the lines and dislikes are an empty array
      if(ctx.instance.userId === undefined) ctx.instance.userId = ctx.options.userId;
      if (ctx.instance.likes === undefined) ctx.instance.likes = [];
      if (ctx.instance.dislikes === undefined) ctx.instance.dislikes = [];
    }
    next();
  });

};
