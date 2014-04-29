var _ = require('underscore');

exports.line_graph = function(req, res){
  var start = req.query.start;
  var end = req.query.end;
  var bound = req.query.bound;
  var nodes = req.db.Node.find({'properties.timestamp': {"$gte":start,"$lt":end}}).limit(bound).exec(function(err, node) {
    res.render('line_graph', _.extend(res.config, { 
      data: node,
      title: 'Line_Graph Test', 
      start: start,
      end: end,
      bound: bound
    }));
  });
};
