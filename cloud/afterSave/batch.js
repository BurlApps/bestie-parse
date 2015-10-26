Parse.Cloud.afterSave("Batch", function(req, res) {  
  var object = req.object
  var active = object.get("active")
  var votes = object.get("votes")
  var userVotes = object.get("userVotes")
  var maxVotes = object.get("userVotes")
  
  if(active && votes == userVotes && votes == 0)  
	  Parse.Cloud.run("newBatchSlack", {
			batch: object.id
		})
})