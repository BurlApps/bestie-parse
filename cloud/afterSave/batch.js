Parse.Cloud.afterSave("Batch", function(req, res) {  
  var object = req.object
  var active = object.get("active")
  var votes = object.get("votes")
  var userVotes = object.get("userVotes")
  var maxVotes = object.get("userVotes")
  var alerted = object.get("alerted")
  
  if(active && userVotes >= maxVotes && alerted != true)  
	  Parse.Cloud.run("newBatchSlack", {
			batch: object.id
		})
})