var User = Parse.User

module.exports.login = function(req, res, next) {
 	var random = Math.random().toString(36).slice(2)
 		
 	if(req.session.user) return next()
  
  var user = new User()
  user.set("username", random)
  user.set("password", random)
  
  user.signUp(null).then(function(user) {
		req.session.user = user
		res.locals.user = user
		next()
  }, res.errorT)
}