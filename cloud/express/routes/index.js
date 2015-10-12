var Twilio = require('twilio')

module.exports.sms = function(req, res) {
  var phone = req.param("number").match(/\d/g)

	if(phone && phone.length > 0) {
	  Parse.Config.get().then(function(config) {
		  var sid = "ACdf6e01e0d0cd943e9aa2a45d6117d624"
		  var token = "addf9c4db22654ab9b978999e319dd70"
	    var client  = Twilio(sid, token)

		  return client.sendSms({
	      to: "+1" + phone.join(""),
	      from: "+18312004372",
	      body: [
		      "Welcome to Bestie! Download the app ",
		      "and find the best photos of you. ",
		      config.get("downloadURL")
	      ].join("")
		  })
		}).then(res.successT, res.errorT)
	} else {
		res.errorT("Invalid phone number :(")
	}
}

module.exports.support = function(req, res, next) {
	res.renderT('home/notfound')
}

module.exports.notfound = function(req, res) {
  res.renderT('home/notfound')
}

module.exports.terms = function(req, res) {
  Parse.Config.get().then(function(settings) {
  	res.redirect(settings.get("termsURL"))
  })
}

module.exports.privacy = function(req, res) {
  Parse.Config.get().then(function(settings) {
  	res.redirect(settings.get("privacyURL"))
  })
}

module.exports.robots = function(req, res) {
  res.set('Content-Type', 'text/plain')
  res.render('seo/robots')
}

module.exports.sitemap = function(req, res) {
  res.set('Content-Type', 'application/xml')
  res.render('seo/sitemap')
}
