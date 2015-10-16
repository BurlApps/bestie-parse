var User = Parse.User

module.exports.login = function(req, res, next) {
 	var random = Math.random().toString(36).slice(2)
 		
 	if(req.session.user) 
 		return module.exports.validate(req, res, next)
  
  var user = new User()
  user.set("username", random)
  user.set("password", random)
  user.set("interested", "female")
  
  user.signUp(null).then(function(user) {	  	  
		req.user = user
		req.session.user = user.id

		next()
  }, res.errorT)
}

module.exports.validate = function(req, res, next) {
	var user = new User()
	
	user.id = req.session.user
	
	user.fetch().then(function(user) {
		req.user = user
		
		return next()
	}, function(error) {
		req.session.user = null
		
		return module.exports.login(req, res, next)
	})
} 

module.exports.interest = function(req, res, next) {  
  req.user.set("interested", req.param("interest"))

  req.user.save().then(function() {		
	  res.successT()
  }, res.errorT)
}