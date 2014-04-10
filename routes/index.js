/* GET home page. */
exports.index = function(req, res){
  res.render('index', { 
  	currentDb: req.db.currentDb,
  	allDbs: req.db.allDbs
  });
};
