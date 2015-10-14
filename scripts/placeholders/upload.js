var fs = require("fs")
var config = JSON.parse(fs.readFileSync(__dirname + "/../../.parse.local", "utf-8"))
var Parse = require("parse/node")
var VoterImage = Parse.Object.extend("Image")
var mode = process.argv[2]
var path = process.argv[3]
var gender = process.argv[4]

if(mode in config.applications) {
	var parse = config.applications[mode]
	Parse.initialize(parse["applicationId"], parse["secret"])
} else {
	return console.error("mode not found")
}

fs.readdir(path, function(err, files) {
	if(err) return console.error(err)
	
	files.forEach(function(filePath) {
		if(["jpg", "jpeg", "png"].indexOf(filePath.split(".")[1]) == -1) return
			
		fs.readFile(path + "/" + filePath, function(err, data) {			
			var fileData = Array.prototype.slice.call(new Buffer(data), 0)
			var file = new Parse.File("image.jpeg", fileData, "image/jpeg")
		
			return file.save().then(function() {
				var image = new VoterImage()
				
				image.set("active", true)
				image.set("image", file)
				image.set("gender", gender)
				
				return image.save()
			}).then(function() {
				console.log("Image uploaded: " + filePath)
			}, function(error) {
				console.error(error)
			})
		})
	})
})