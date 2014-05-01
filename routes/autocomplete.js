exports.autocomplete = function(req, res){
  var nodes = req.db.Node.distinct('properties.user').exec(function(err, nodes) {
    res.send(nodes);  
  });
};
