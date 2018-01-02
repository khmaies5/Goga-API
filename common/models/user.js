'use strict';

module.exports = function(User) {


//send verification email after registration
User.afterRemote('create', function(context, user, next) {
  var options = {
    type: 'email',
    to: user.email,
    from: 'khmaieshassen@gmail.com',
    subject: 'Thanks for registering.',
    html: user.verificationToken,
    user: user
  };

  user.verify(options, function(err, response) {
    if (err) {
      User.deleteById(user.id);
      return next(err);
    }
  });
});






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
  User.on('resetPasswordRequest', function(info) {
   
    var html = info.accessToken.id + '">here</a> to reset your password';

    User.app.models.Email.send({
      to: info.email,
      from: 'khmaieshassen@gmail.com',
      subject: 'Password reset',
      html: html
    }, function(err) {
      if (err) return console.log('> error sending password reset email');
      console.log('> sending password reset email to:', info.email);
    });
  });

};
