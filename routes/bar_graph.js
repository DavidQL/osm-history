var _ = require('underscore');

exports.bar_graph = function(req, res){
  var username = req.params.username;
  var nodes = req.db.Node.find({'properties.user': username}).limit(200).exec(function(err, node) {
    res.render('bar_graph', _.extend(res.config, { 
      data: node, 
      title: 'D3 Test', 
      user: username
    }));
  });
};
