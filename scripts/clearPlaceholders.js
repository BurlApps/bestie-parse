var Parse = require("parse/node")
var VoterImage = Parse.Object.extend("Image")

Parse.initialize("q1NZZSGYNxaYIQq5dDNkMlD407fmm2Hq6BoXBzu4", "m736Jb7Z8atZGPSfW7eBnrOKwJNyDDSUFmTOVT5G")

var query = new Parse.Query(VoterImage) 

query.doesNotExist("creator")

query.each(function(image) {	
	console.log("Image deleted: " + image.id)
	return image.destroy()
})