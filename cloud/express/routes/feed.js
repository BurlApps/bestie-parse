module.exports.home = function(req, res) {
  res.renderT('feed/index')
}

module.exports.feed = function(req, res) {	
	Parse.Cloud.run("feed", {
		user: req.user.id
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
		user: req.user.id,
		winner: req.param("winner"),
		loser: req.param("loser")
	}).then(res.successT, res.errorT)
}
