'use strict';

var loopback = require('loopback');
var app = module.exports = loopback();
var path = require('path');



module.exports = function (User) {


 


   


  // send verification email after registration
  User.afterRemote('create', function (context, user, next) {
    var verifyoptions = {
      type: 'email',
      to: user.email,
      from: 'hssen.khmaies@esprit.tn',
      subject: 'Thanks for registering.',
      text: 'testing the text',
      template: '<html></html>',
      verifyHref: '<p> khmaies '+User.verificationToken+'</p>',
      html: '<p> khmaies '+User.verificationToken+'</p>',
      user: user,
    };

    var options = {
      type: 'email',

   
      to: user.email,
      from: 'hssen.khmaies@esprit.tn',
      subject: 'Thanks for joining Goga!',

      template: path.resolve(__dirname, '../../client/templates/verify.ejs'),
      
      user: user,

      verifyHref: "  "
     
    };

   /* User.app.models.Email.send({
      type: 'email',
      to: user.email,
      from: 'hssen.khmaies@esprit.tn',
      subject: 'Thanks for registering.',
      html: '<p> khmaies '+User.verificationToken+'</p>',
      user: user,
    }, function (err, email) {
      if(err) {
        console.log("options "+options);
        console.log("mail err "+err);

        next(err);
      } else {
        console.log("options "+options.html);

        console.log("mail sent ");
      }
    });*/


    user.verify(options, function(err, response, next) {
      if (err) return next(err);
        
      console.log('> verification email sent:', response);

    });


   /* user.verify(options, function (err, response) {
      if (err) {
       console.log("verify err "+err);
        // User.deleteById(user.id);
        return next(err);
      } else {
        User.app.models.Email.send({
          type: 'email',
          to: user.email,
          from: 'hssen.khmaies@esprit.tn',
          subject: 'Thanks for registering.',
          html: '<p> khmaies '+user.verificationToken+'</p>',
          user: user,
        }, function (err, email) {
          if(err) {
            console.log("mail err "+err);

            next(err);
          } else {
            console.log("mail sent ");
          }
        });
      }
    });*/
    next();
  });

  let Role;
  let RoleMapping;

  User.on('attached', function (a) {
    Role = app.models.Role;
    RoleMapping = app.models.RoleMapping;
    // perform any setup that requires the app object
  })

  User.updatePassword = function (ctx, emailVerify, oldPassword, newPassword, cb) {
    var newErrMsg, newErr;
    console.log('accesstoken ', ctx.req.query.access_token);
    try {
      this.findOne({
        where: {
          id: ctx.req.query.access_token.userId,
          email: emailVerify
        }
      }, function (err, user) {
        if (err) {
          cb(err);
        } else if (!user) {
          newErrMsg = 'No match between provided current logged user and email';
          newErr = new Error(newErrMsg);
          newErr.statusCode = 401;
          newErr.code = 'LOGIN_FAILED_EMAIL';
          cb(newErr);
        } else {
          user.hasPassword(oldPassword, function (err, isMatch) {
            if (isMatch) {
              // TODO ...further verifications should be done here (e.g. non-empty new password, complex enough password etc.)...

              user.updateAttributes({
                'password': newPassword
              }, function (err, instance) {
                if (err) {
                  cb(err);
                } else {
                  cb(null, true);
                }
              });
            } else {
              newErrMsg = 'User specified wrong current password !';
              newErr = new Error(newErrMsg);
              newErr.statusCode = 401;
              newErr.code = 'LOGIN_FAILED_PWD';
              return cb(newErr);
            }
          });
        }
      });
    } catch (err) {
      console.log(err);
      cb(err);
    }
  };

  User.remoteMethod(
    'updatePassword', {
      description: 'Allows a logged user to change his/her password.',
      http: {
        verb: 'put'
      },
      accepts: [{
          arg: 'ctx',
          type: 'object',
          http: {
            source: 'context'
          }
        },
        {
          arg: 'emailVerify',
          type: 'string',
          required: true,
          description: 'The user email, just for verification'
        },
        {
          arg: 'oldPassword',
          type: 'string',
          required: true,
          description: 'The user old password'
        },
        {
          arg: 'newPassword',
          type: 'string',
          required: true,
          description: 'The user NEW password'
        },
      ],
      returns: {
        arg: 'passwordChange',
        type: 'boolean'
      },
    }
  );




  /*   User.sendEmail = function(cb,user) {
        User.app.models.Email.send({
          to: user.mail,
          from: 'khmaieshassen@gmail.com',
          subject: 'my subject',
          text: 'my text',
          html: 'my <em>html</em>'
        }, function(err, mail) {
          console.log('email sent!');
          cb(err);
        });
      }
*/


  //send password reset link when requested
  User.on('resetPasswordRequest', function (info) {
    var html = info.accessToken.id + '">here</a> to reset your password';

    User.app.models.Email.send({
      to: info.email,
      from: 'khmaieshassen@gmail.com',
      subject: 'Password reset',
      html: html,
    }, function (err) {
      if (err) return console.log('> error sending password reset email');
      console.log('> sending password reset email to:', info.email);
    });
  });

 



};
