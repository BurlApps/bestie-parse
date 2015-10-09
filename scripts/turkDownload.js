var fs = require("fs")
var http = require('http-request')
var csv = require('csv2array')
var path = process.argv[2]
var output = process.argv[3]
var indexes = {}

if(!fs.existsSync(output)) {
  fs.mkdirSync(output)
}

fs.readFile(path, 'utf8', function(err, data) {	
	csv(data).forEach(function(item, i) {
		if(i == 0) {
			return item.forEach(function(name, index) {
				indexes[name] = index
			})
		}
		
		item[indexes["Answer.selected"]].split("|").forEach(function(answer) {			
			var link = item[indexes["Input." + answer]]
			var split = link.split("/")
			var downloadPath = split[split.length - 1]
			
			http.get({ url: link }, output + "/" + downloadPath, function(error) {
				if(error) {
		      console.error(error);
		    } else {
		      console.log('File downloaded: ' + link);
		    }
			})
		})
	})
	 
})
