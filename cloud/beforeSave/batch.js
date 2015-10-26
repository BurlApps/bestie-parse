Parse.Cloud.beforeSave("Batch", function(req, res) {
  var object = req.object
  var active = object.get("active")
  var votes = object.get("votes")
  var userVotes = object.get("userVotes")
	var maxVotes = object.get("maxVotes")
	var creator = object.get("creator")
	
	if(object.isNew()) {
		object.set("votes", 0)
		object.set("userVotes", 0)
		object.set("override", false)
		object.set("alerted", false)
		
		return res.success()
	}

	if(active) {
		var newActive = votes < maxVotes || userVotes < maxVotes
	
		object.set("active", newActive)
		
		if(!newActive && creator)
			Parse.Cloud.run("batchCompleted", {
				user: creator.id
			})
	}

  return res.success()
})
