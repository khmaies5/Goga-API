'use strict';

module.exports = function(Attachment) {
    Attachment.beforeRemote('create', function(ctx, attachment, next) {
        var body = ctx.req.body;
        
        body.name = "test.jpg";
        console.log("image name ",body.name);
        next();
      });
};
