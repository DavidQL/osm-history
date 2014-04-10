/* GET home page. */
exports.index = function(req, res){
  res.render('index', { 
  	currentDb: req.session.currentDb || req.db.defaultDbName,
  	allDbs: req.db.allDbs
  });
};
