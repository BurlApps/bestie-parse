var Batch = Parse.Object.extend("Batch")
var Image = Parse.Object.extend("Image")

Parse.Cloud.define("setVoted", function(req, res) {
	var user = Parse.User.current()
	var winner = new Image()
	var looser = new Image()
	
	winner.id = req.params.winner
	looser.id = req.params.looser
	
	winner.increment("votes")
	winner.increment("wins")
	
	looser.increment("votes")
	looser.increment("losses")
	
	winner.fetch().then(function() {
		return looser.fetch()
	}).then(function() {
		var wRelation = winner.relation("voters")
		var lRelation = winner.relation("voters")
		
		winner.increment("opponents", looser.get("score"))
		looser.increment("opponents", winner.get("score"))
		
		wRelation.add(user)
		lRelation.add(user)
		
		return winner.save()
	}).then(function() {
		return looser.save()
	}).then(function() {
		var batch = winner.get("batch")
		
		if(!batch) return
		
		batch.increment("votes")
		return batch.save()
	}).then(function() {
		var batch = looser.get("batch")
		
		if(!batch) return
		
		batch.increment("votes")
		return batch.save()
	}).then(function() {
		var batch = user.get("batch")
		
		if(!batch) return
		
		batch.increment("userVotes")
		return batch.save()
	}).then(function(batch) {
		res.success(batch)
	})
})