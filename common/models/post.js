'use strict';
//var rating = require('rating');
var fs = require('fs');
module.exports = function(Post) {

    var i ;
    var ratingsList;
    var array = [];

    var app = require('../../server/server');

    // Make sure emailVerified is not set by creation
    Post.beforeRemote('create', function(ctx, post, next) {
        var body = ctx.req.body;
        body.datepublication = Date.now();
        body.category = "todo";



        next();
      });


    Post.getPostRatings = function(id,cb) {

        //var filter = { include : [ 'DETAILS'] };
        // get posts
        Post.find(function(err, posts) {
            if(err) {
                console.log(err);
            } else {
                // get the Generics
                //var Rapp =  Post.app;
                console.log("posts list ",posts.length);

                posts.forEach(function (post) {
                    post.rating = [];
                })
                var GenericModel = app.models.rating;


                GenericModel.find(function(err, ratings) {


                    if(err) {
                        console.log(err);
                    } else {

                        for(var r = 0;r < ratings.length;r++){
                            for(var l=0;l<posts.length;l++){


                                if(""+ratings[r].postId == ""+posts[l].id){
                                    //console.log("r ",ratings[r].postId);

                                    array.push(ratings[r]);
                                    posts[l].rating.push(ratings[r]);

                                } else if(""+ratings[r].postId != ""+posts[l].id){
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
        accepts: [{arg: 'id', type: 'string'}],
        returns: {arg: 'Posts', type: 'object'},
        http: {path:'/withRatings', verb: 'get'}
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

        var path = 'http://localhost/img/';
        
        

        
        

        
        //res.send(imageName);


        

        return imageName;
      }
};
