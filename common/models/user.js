'use strict';

module.exports = function(User) {

    User.sendEmail = function(cb,user) {
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

};
