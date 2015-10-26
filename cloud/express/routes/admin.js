var Batch = Parse.Object.extend("Batch")
var Image = Parse.Object.extend("Image")
var User = Parse.User

module.exports.auth = function(req, res, next) {
	req.basicAuth(function(user1, pass1) {
    var user2 = "admin"
    var pass2 = "1Burrito2Go"

    return (user1 == user2 && pass1 == pass2)
  })(req, res, next)
}

module.exports.batches = function(req, res) {
	var query = new Parse.Query(Batch)
	var batches = []
	
	query.equalTo("active", true)
	query.notEqualTo("override", true)
	query.greaterThan("maxVotes", 0)
	
	query.each(function(batch) {
		var relation = batch.relation("images")
		var imagesQuery = relation.query()
		
		if(batch.get("userVotes") >= batch.get("maxVotes"))
			return
		
		imagesQuery.descending("percent")
		
		return imagesQuery.find(function(images) {			
			if(images.length > 0)
				return batches.push({
					id: batch.id,
					images: images,
					creator: batch.get("creator").id
				})
		})
	}).then(function() {
		res.renderT("admin/index", {
			batches: batches
		})
	}, res.errorT)
}

module.exports.user = function(req, res) {
	var query = new Parse.Query(Batch)
	var creator = new User()
	var batches = []
	
	creator.id = req.param("user")
	
	query.equalTo("creator", creator)
	query.equalTo("active", false)
	
	query.each(function(batch) {
		var relation = batch.relation("images")
		var imagesQuery = relation.query()
		
		imagesQuery.descending("percent")
		
		return imagesQuery.find(function(images) {			
			if(images.length > 0)
				return batches.push({
					id: batch.id,
					images: images
				})
		})
	}).then(function() {
		res.renderT("admin/user", {
			batches: batches
		})
	}, res.errorT)
}

module.exports.batch = function(req, res) {
	var batch = new Batch()
	var images = req.param("images")
	
	batch.id = req.param("batch")
	
	batch.fetch().then(function() {
		var promise = Parse.Promise.as()
	
		Object.keys(images).forEach(function(key) {
			promise = promise.then(function() {
				var image = new Image()
				var percent = Number(images[key])
				
				image.id = key
				image.set("override", true)
				image.set("percent", percent)
				image.set("score", Math.floor(percent * 100))
				
				return image.save()
			})
		})
		
		return promise
	}).then(function() {
		batch.set("override", true)
		batch.set("votes", batch.get("maxVotes"))
		
		return batch.save()
	}).then(function() {
		res.successT()
	}, res.errorT)
}