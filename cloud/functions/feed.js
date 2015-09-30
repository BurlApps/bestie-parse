var Image = Parse.Object.extend("Image")

Parse.Cloud.define("feed", function(req, res) {
	var user = Parse.User.current()
	var query = new Parse.Query(Image)
	
	user.fetch().then(function(user) {		
		query.exists("image")
		query.notEqualTo("flagged", true)
		query.equalTo("active", true)
		query.notEqualTo("voters", user)
		query.notEqualTo("creator", user)
		query.equalTo("gender", user.get("interested"))
		query.limit(50)
		
		if(Math.random() >= 0.5) 
			query.ascending("objectId")
		else
			query.descending("objectId")
			
		query.find(function(images) {
			res.success(images)
		})
	})
})