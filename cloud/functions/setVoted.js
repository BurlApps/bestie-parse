var Batch = Parse.Object.extend("Batch")
var Image = Parse.Object.extend("Image")

Parse.Cloud.define("setVoted", function(req, res) {
	var user = Parse.User.current()
	var winner = new Image()
	var loser = new Image()
	
	winner.id = req.params.winner
	loser.id = req.params.loser
	
	var date = new Date()
	
	winner.fetch().then(function() {
		return loser.fetch()
	}).then(function() {
		var wRelation = winner.relation("voters")
		var lRelation = winner.relation("voters")
		
		winner.increment("opponents", loser.get("score"))		
		winner.increment("votes")
		winner.increment("wins")
	
		loser.increment("votes")
		loser.increment("losses")
		loser.increment("opponents", winner.get("score"))
		
		wRelation.add(user)
		lRelation.add(user)
		
		return winner.save()
	}).then(function() {
		return loser.save()
	}).then(function() {
		var batch = winner.get("batch")
		
		if(!batch) return
		
		batch.increment("votes")
		return batch.save()
	}).then(function() {
		var batch = loser.get("batch")
		
		if(!batch) return
		
		batch.increment("votes")
		return batch.save()
	}).then(function() {
		var batch = user.get("batch")
		
		if(!batch) return
		
		batch.increment("userVotes")
		
		return batch.save().then(function() {
			return batch.fetch()
		}) 
	}).then(function(batch) {
		var result
		
		if(batch) {
			result = {
				userVotes: batch.get("userVotes"),
				finished: batch.get("userVotes") == batch.get("maxVotes")
			}
		}
			
		res.success(result)
	}, res.error)
})