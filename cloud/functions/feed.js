var Image = Parse.Object.extend("Image")

Parse.Cloud.define("feed", function(req, res) {
	var user = Parse.User.current()
	var query = new Parse.Query(Image)
	var random = Math.random() >= 0.5
	
	if(!user) res.success(false)
	
	user.fetch().then(function(user) {	
		var interested = user.get("interested")
			
		query.exists("image")
		query.notEqualTo("flagged", true)
		query.notEqualTo("active", false)
		//query.notEqualTo("voters", user)
		query.notEqualTo("creator", user)
		query.limit(50)
		
		if(interested) {
			if(interested != "both")
				query.equalTo("gender", interested)
			else
				query.equalTo("gender", random ? "male" : "female")		
		}
		
		query.ascending("priority")
		
		if(random) 
			query.ascending("objectId")
		else
			query.descending("objectId")
			
		query.find(function(images) {			
			res.success(images)
		}, res.error)
	})
})