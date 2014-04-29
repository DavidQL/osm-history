var _ = require('underscore');

exports.bar_graph = function(req, res){
  var username = req.params.username;
  res.render('bar_graph', _.extend(res.config, {  
    title: 'D3 Test', 
    user: username
  }));
};
