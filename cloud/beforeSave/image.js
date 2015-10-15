Parse.Cloud.beforeSave("Image", function(req, res) {
  var object = req.object
  
  return Parse.Config.get().then(function(config) {
	  var batch = object.get("batch")
		var wins = object.get("wins")
		var losses = object.get("losses")
		var votes = object.get("votes")
		var active = object.get("active")
		var maxVotes = object.get("maxVotes")
		var opponents = object.get("opponents")
		var multiplier = config.get("imageMultiplier")
		var priority = config.get("priority")
		var score = Math.ceil((opponents + (multiplier * (wins - losses))) / Math.max(votes, 1))
		var random = Math.random() * 0.35 + 0.5
	
	  if(!object.isNew()) {			
			if(votes > 0) {
				object.set("score", score)
				
				if(votes > 5)
					object.set("percent", wins/votes)
				else
					object.set("percent", random)
			}
			
			object.set("priority", Math.floor(votes/maxVotes))
		  
		  return res.success()
	  }
		
		object.set("active", !!object.get("active"))
		object.set("votes", 0)
		object.set("percent", random)
		object.set("maxVotes", maxVotes || config.get("imageMaxVotes"))
		object.set("score", config.get("imageStarter"))
		object.set("wins", 0)
		object.set("losses", 0)
		object.set("opponents", 0)
		object.set("flagged", false)
		object.set("priority", 0)
		
		return res.success()
	})
})
