var fs = require("fs")
var config = JSON.parse(fs.readFileSync(__dirname + "/../../.parse.local", "utf-8"))
var Parse = require("parse/node")
var VoterImage = Parse.Object.extend("Image")

if(mode in config.applications) {
	var parse = config.applications[mode]
	Parse.initialize(parse["applicationId"], parse["secret"])
} else {
	return console.error("mode not found")
}

var query = new Parse.Query(VoterImage) 

query.each(function(image) {	
	console.log("Image deleted: " + image.id)
	return image.destroy()
})