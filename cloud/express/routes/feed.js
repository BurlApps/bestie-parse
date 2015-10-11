module.exports.feed = function(req, res) {		
	Parse.Cloud.run("feed", {
		user: req.session.user.id || req.session.user.objectId
	}).then(function(results) {
		res.successT(results.map(function(item) {
			return {
				image: item.get("image").url(),
				percent: item.get("percent"),
				id: item.id
			}
		}))
	}, res.errorT)
}

module.exports.voted = function(req, res) {		
	Parse.Cloud.run("setVoted", {
		user: req.session.user.id || req.session.user.objectId,
		winner: req.param("winner"),
		looser: req.param("looser")
	}).then(res.successT, res.errorT)
}
