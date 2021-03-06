var Image = Parse.Object.extend("Image")

Parse.Cloud.define("feed", function(req, res) {
	var user = Parse.User.current()
	var query = new Parse.Query(Image)
	var random = Math.random() >= 0.5
	
	if(!user) {
		if(req.params.user) {
			user = new Parse.User()
			user.id = req.params.user
		} else {
			return res.success([])
		}
	}
	
	user.fetch().then(function(user) {	
		var interested = user.get("interested")
			
		query.exists("image")
		query.notEqualTo("flagged", true)
		query.notEqualTo("active", false)
		//query.notEqualTo("voters", user)
		query.notEqualTo("creator", user)
		query.notEqualTo("percent", 0)
		query.limit(50)
		
		if(interested) {
			if(interested != "both")
				query.equalTo("gender", interested)
			else
				query.equalTo("gender", random ? "male" : "female")		
		}
		
		query.ascending("priority", "updatedAt")
			
		query.find(function(images) {			
			res.success(images.sort(function() {
			  return Math.random() - Math.random();
			}))
		}, res.error)
	})
})