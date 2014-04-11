var _ = require('underscore');

exports.index = function(req, res){
  res.render('index', _.extend(res.config, {}));
};
