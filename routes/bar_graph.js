var _ = require('underscore');

exports.bar_graph = function(req, res){
  var username = req.query.username;
  var start_date= req.query.start_date;
  var end_date=req.query.end_date;
  res.render('bar_graph', _.extend(res.config, {  
    title: 'D3 Test', 
    user: username,
    start_date: start_date,
    end_date: end_date
  }));
};
