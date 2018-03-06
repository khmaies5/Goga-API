/**
* This boot script defines custom Express routes not tied to models
**/

module.exports = function(app) {

  var Post = app.models.Post;

  /**
  * Defines a routes so that posts are accessible by user
  * /useerId/postId
  **/
  app.get('/:user/:post', function(req, res) {
    Post.findOne({ where: {userId: req.params.user,id: req.params.post}, include: 'comments'}, function(err, record){
      if (err) res.send(err);
      if (!err && record) {
        res.send(record);
      } else {
        res.sendStatus(404);
      }
    });
  });

   /**
  * Defines a routes so that posts are accessible by user
  * /postId
  **/
  app.get('/:post', function(req, res) {
    Post.findOne({ where: {id: req.params.post}, include: {
      relation: "comments",
      scope: {
        include: "user"
      }
    }}, function(err, record){
      if (err) res.send(err);
      if (!err && record) {
        res.send(record);
      } else {
        res.sendStatus(404);
      }
    });
  });

}
