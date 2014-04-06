/* GET home page. */
exports.index = function(req, res){
  res.render('index', { title: 'This variable is set in index.js' });
};
