var fs = require("fs")
var csv = require("to-csv")
var Parse = require("parse/node")
var count = 0
var list = []
var item = {}
var total = 0
var path = process.argv[2]
var output = process.argv[3]

Parse.initialize("q1NZZSGYNxaYIQq5dDNkMlD407fmm2Hq6BoXBzu4", 
								 "m736Jb7Z8atZGPSfW7eBnrOKwJNyDDSUFmTOVT5G")

fs.readdir(path, function(err, files) {
	if(err) return console.error(err)
	
	files.forEach(function(filePath) {
		if(["jpg", "jpeg", "png"].indexOf(filePath.split(".")[1]) == -1) return
		
		fs.readFile(path + "/" + filePath, function(err, data) {
			var fileData = Array.prototype.slice.call(new Buffer(data), 0)
			var file = new Parse.File("image.jpeg", fileData, "image/jpeg")
			
			return file.save().then(function() {
				if(count++ >= 8) {
					list.push(item)
					item = {}
					count = 0
				}
				
				item["image" + count] = file.url()
				
				if(++total == files.length - 1) {
					list.push(item)
					fs.writeFile(output, csv(list))
					console.log("done")
				}
			}, function(error) {
				console.error(error)
			})
		})
	})
})