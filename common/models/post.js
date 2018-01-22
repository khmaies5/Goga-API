'use strict';
//var rating = require('rating');
var fs = require('fs');
var request = require('request');
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
        Post.find({
            order: 'datepublication DESC'
          },function(err, posts) {
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



    Post.getPostRatingsDesc = function(id,cb) {

        //var filter = { include : [ 'DETAILS'] };
        // get posts
        Post.find({
            order: 'rating DESC'
          },function(err, posts) {
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



    Post.remoteMethod('getPostRatingsDesc', {
        accepts: [{arg: 'id', type: 'string'}],
        returns: {arg: 'Posts', type: 'object'},
        http: {path:'/withRatingsDesc', verb: 'get'}
    });



///////////////////


Post.senNotif = function(id,title,msg,cb) {


    var url = "https://fcm.googleapis.com/fcm/send";
   
var serverKey = 'AAAAZqyMyrw:APA91bGSjh35Vub6_pD0XERvUmuCp4JhcPa8wINY4neFCUDfkvP64e2fLVV-cVyo_HRn6EcIDiA2xpAv2C_b8bSao3JytgWyyPp2fnR2qQcNf7BEGUxeG_eHlqq1F3v9A4SY5qudz9CN';

var token = "/topics/"+id ;
var notification = {"title": title , "text": msg, "sound" : "default", "badge" : "1"};
var arraytosend = {"to" : token, "notification" : notification,"priority" : "high"};
//var headers = {'Content-Type: application/json','Authorization: key='+serverKey};
    request.post({
        url: url,
        method: 'POST',
        headers: {"Content-Type": "application/json","Authorization": "key="+ serverKey},
        json: arraytosend
      }, function(err, response) {
        if (err) console.error(err);

        console.log("notif response",response.send);
        cb(null,response);
      });
};



Post.remoteMethod('senNotif', {
    accepts: [{arg: 'id', type: 'string'},{arg:'msg',type:'string'},{arg:'title',type:'string'}],
    returns: {arg: 'Response', type: 'object'},
    http: {path:'/senNotif', verb: 'post'}
});

/////////////////


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
