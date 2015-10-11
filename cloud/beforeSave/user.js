Parse.Cloud.beforeSave(Parse.User, function(req, res) {
  var object = req.object
	
	if(object.isNew()) {
		object.set("shared", false)
		object.set("gender", object.get("gender") || "male")
		object.set("interested", object.get("interested") || "female")
		
		return res.success()
	}

  return res.success()
})
