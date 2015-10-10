var Parse = require("parse/node")
var VoterImage = Parse.Object.extend("Image")
var mode = process.argv[2]

if(mode == "release") {
	Parse.initialize("2umHhGkMh7Gm6dU8rRVgHSPzbW5xOymXzenDx2XC", "hu5nnIlQYKc22ly6JAZE3LxcNTPVYGHdhYAyDYr3")
} else {
	Parse.initialize("q1NZZSGYNxaYIQq5dDNkMlD407fmm2Hq6BoXBzu4", "m736Jb7Z8atZGPSfW7eBnrOKwJNyDDSUFmTOVT5G")
}

var query = new Parse.Query(VoterImage) 

query.doesNotExist("creator")

query.each(function(image) {	
	console.log("Image deleted: " + image.id)
	
	return image.destroy()
})