/* GET d3 test page. */
exports.d3 = function(req, res){
  var username = req.params.username;
  var nodes = req.db.Node.find({'properties.user': username}).limit(200).exec(function(err, node) {
    res.render('d3', { data: node, title: 'D3 Test', user: username }); 
  });
};
