'use strict';

module.exports = function(Attachment) {
<<<<<<< HEAD
    
=======
    Attachment.beforeRemote('create', function(ctx, attachment, next) {
        var body = ctx.req.body;
        
        body.name = "test.jpg";
        console.log("image name ",body.name);
        next();
      });
>>>>>>> 18eefd53996de5022b2f08a6a82a50647919ad3d
};
