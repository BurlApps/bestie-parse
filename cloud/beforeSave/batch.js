Parse.Cloud.beforeSave("Batch", function(req, res) {
  var object = req.object
  var active = object.get("active")
  var votes = object.get("votes")
  var userVotes = object.get("userVotes")
	var maxVotes = object.get("maxVotes")
	
	if(object.isNew()) {
		object.set("votes", 0)
		object.set("userVotes", 0)
		
		return res.success()
	}

	if(active) {
		var newActive = votes < maxVotes || userVotes < maxVotes
	
		object.set("active", newActive)
		
		if(!newActive)
			Parse.Cloud.run("batchCompleted", {
				user: object.get("creator").id
			})
	}

  return res.success()
})
