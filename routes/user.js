exports.nodes = function(req, res){
  var username = req.params.username;
  var nodes = req.db.Node.find({'properties.user': username}).limit(20).exec(function(err, node) {
    res.send(node);  
  });
};
