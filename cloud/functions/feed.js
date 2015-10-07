var Image = Parse.Object.extend("Image")

Parse.Cloud.define("feed", function(req, res) {
	var user = Parse.User.current()
	var query = new Parse.Query(Image)
	
	if(!user) res.success(false)
	
	user.fetch().then(function(user) {	
		var interested = user.get("interested")
			
		query.exists("image")
		query.notEqualTo("flagged", true)
		query.notEqualTo("active", false)
		//query.notEqualTo("voters", user)
		query.notEqualTo("creator", user)
		query.limit(50)
		
		if(interested && interested != "both") {
			query.equalTo("gender", interested)
		}
		
		query.ascending("priority")
		
		if(Math.random() >= 0.5) 
			query.ascending("objectId")
		else
			query.descending("objectId")
			
		query.find(function(images) {			
			res.success(images)
		})
	})
})