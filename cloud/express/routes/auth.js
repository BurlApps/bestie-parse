var User = Parse.User

module.exports.login = function(req, res, next) {
 	var random = Math.random().toString(36).slice(2)
 		
 	if(req.session.user) return next()
  
  var user = new User()
  user.set("username", random)
  user.set("password", random)
  user.set("interested", "female")
  
  user.signUp(null).then(function(user) {	  
	  var tmp = JSON.parse(JSON.stringify(user))
	  
		req.session.user = tmp
		res.locals.user = tmp

		next()
  }, res.errorT)
}

module.exports.interest = function(req, res, next) {  
  var user = new User()
  
  user.id = req.session.user.objectId,
  
  user.set("interested", req.param("interest"))

  user.save().then(function() {
	  res.successT()
  }, res.errorT)
}