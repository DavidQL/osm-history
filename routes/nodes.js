exports.versions = function(req, res){
  var id = req.params.id;
  var nodes = req.db.Node.find({'id': parseInt(id, 10)}).sort('date').exec(function(err, nodes) {
    res.send(nodes);  
  });
};
