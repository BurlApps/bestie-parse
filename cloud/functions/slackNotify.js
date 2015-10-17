var Batch = Parse.Object.extend("Batch")

Parse.Cloud.define("newBatchSlack", function(req, res) {
  var batch = new Batch()

  batch.id = req.params.batch

  batch.fetch().then(function() {
	  var query = batch.relation("images").query()
	  
	  return query.count()
  }).then(function(count) {
	  req.count = count
	  
	  
	  return batch.get("creator").fetch()
	}).then(function(creator) {
		req.creator = creator
		
		return Parse.Config.get()
	}).then(function(config) {
		var pretext = "New batch was created"
	  
	  if(config.get("slack") && req.count > 0)
	  	return Parse.Cloud.httpRequest({
	      url: config.get("slackGeneral"),
	      method: "POST",
	      followRedirects: true,
	      body: JSON.stringify({
					attachments:[{
						fallback: pretext,
						pretext: pretext,
						color: "danger",
						fields: [{
							title: "Creator: " + req.creator.get("gender"),
							value: "Images uploaded: " + req.count,
							short: true
						}]
	      	}]
	      })
	    })
  }).then(function() {
    res.success("New batch notification sent")
  }, function(error) {
    console.error(error)
    res.error(error.message)
  })
})