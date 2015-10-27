Parse.Cloud.afterSave("Batch", function(req, res) {  
  var object = req.object
  var active = object.get("active")
  var votes = object.get("votes")
  var userVotes = object.get("userVotes")
  var maxVotes = object.get("maxVotes")
  var alerted = object.get("alerted")
  var override = object.get("override")
  
  if(active && userVotes >= maxVotes && alerted != true && override != true)  
	  Parse.Cloud.run("newBatchSlack", {
			batch: object.id
		})
})