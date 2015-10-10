var fs = require("fs")
var Parse = require("parse/node")
var VoterImage = Parse.Object.extend("Image")
var easyimg = require('easyimage')
var mode = process.argv[2]
var path = process.argv[3]
var gender = process.argv[4]
var tmp = "/tmp/Placeholders" + Math.ceil(Math.random() * 500)

if(mode == "release") {
	Parse.initialize("2umHhGkMh7Gm6dU8rRVgHSPzbW5xOymXzenDx2XC", "hu5nnIlQYKc22ly6JAZE3LxcNTPVYGHdhYAyDYr3")
} else {
	Parse.initialize("q1NZZSGYNxaYIQq5dDNkMlD407fmm2Hq6BoXBzu4", "m736Jb7Z8atZGPSfW7eBnrOKwJNyDDSUFmTOVT5G")
}

if(!fs.existsSync(tmp)) {
  fs.mkdirSync(tmp)
}

fs.readdir(path, function(err, files) {
	if(err) return console.error(err)
	
	files.forEach(function(filePath) {
		if(["jpg", "jpeg", "png"].indexOf(filePath.split(".")[1]) == -1) return
		
		var tmpPath = filePath.split(".")[0] + ".jpeg"
		
		easyimg.rescrop({
			src: path + "/" + filePath,
			dst: tmp + "/" + tmpPath,
			width: 640,
			height: 640,
			cropwidth: 640,
			cropheight: 640,
			quality: 90,
			flatten: true,
			gravity: "North"
		}).then(function() {		
			fs.readFile(tmp + "/" + tmpPath, function(err, data) {
				var fileData = Array.prototype.slice.call(new Buffer(data), 0)
				var file = new Parse.File("image.jpeg", fileData, "image/jpeg")
			
				return file.save().then(function() {
					var image = new VoterImage()
					
					image.set("active", true)
					image.set("image", file)
					image.set("gender", gender)
					
					return image.save()
				}).then(function() {
					console.log("Image uploaded: " + tmpPath)
				}, function(error) {
					console.error(error)
				})
			})
		}, function(error) {
			console.error(error)
		})
	})
})