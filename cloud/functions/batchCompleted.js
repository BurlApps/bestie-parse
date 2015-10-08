var User = Parse.User
var Installation = Parse.Installation

Parse.Cloud.define("batchCompleted", function(req, res) {
	var user = new User()
	var query = new Parse.Query(Installation)
  
	user.id = req.params.user
	query.equalTo("user", user)
	
	Parse.Push.send({
	  where: query,
	  data: {
      actions: "batch.reload",
      message: "Your Bestie is ready!",
      alert: "Your Bestie is ready!",
      badge: "Increment"
    }
  }).then(function() {
	  res.success("Successfully sent message to creator.")
  }, res.error)
})