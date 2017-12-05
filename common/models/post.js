'use strict';

module.exports = function(Post) {
  
    // Make sure emailVerified is not set by creation
    Post.beforeRemote('create', function(ctx, post, next) {
        var body = ctx.req.body;
        console.log("image name ",decodeImg(body.type)) ;
          //body.emailVerified = false;
        body.type = decodeImg(body.type);
        next();
      });


      function decodeImg(imgEncoded){

        var img = imgEncoded;
        var d=new Date().valueOf();
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
        for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        
        if("jpeg"==img.split(";")[0].split("/")[1])
        {
        var imageName = d + '.' + text + '.jpg';
        }
        if("gif"==img.split(";")[0].split("/")[1])
        {
        var imageName = d + '.' + text + '.gif';
        }
        if("x-icon"==img.split(";")[0].split("/")[1])
        {
        var imageName = d + '.' + text + '.ico';
        }
        if("png"==img.split(";")[0].split("/")[1])
        {
        var imageName = d + '.' + text + '.png';
        }
        var data = img.replace(/^data:image\/\w+;base64,/, "");
        
        var buf = new Buffer(data, 'base64');

        return imageName;
      }
};
