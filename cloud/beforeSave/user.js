Parse.Cloud.beforeSave(Parse.User, function(req, res) {
  var object = req.object
	
	if(object.isNew()) {
		object.set("shared", false)
		object.set("gender", "female")
		object.set("interested", "both")
		
		return res.success()
	}

  return res.success()
})
