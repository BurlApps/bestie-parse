var fs = require("fs")
var easyimg = require('easyimage')
var path = process.argv[2]
var output = process.argv[3]

if(!fs.existsSync(output)) {
  fs.mkdirSync(output)
}

fs.readdir(path, function(err, files) {
	if(err) return console.error(err)
	
	files.forEach(function(filePath) {
		if(["jpg", "jpeg", "png"].indexOf(filePath.split(".")[1]) == -1) return
		
		var tmpPath = filePath.split(".")[0] + ".jpeg"
		
		easyimg.thumbnail({
			src: path + "/" + filePath,
			dst: output + "/" + tmpPath,
			width: 640,
			height: 640,
			quality: 100,
			flatten: true,
			x: 0,
			y: 0,
			gravity: "North",
			background: "white",
			ignoreAspectRatio: false
		}).then(function() {
			console.log("Image cropped: " + tmpPath)
		})
	})
})