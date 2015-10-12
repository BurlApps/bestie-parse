var express = require('express')
var app = express()
var random = Math.random().toString(36).slice(2)

// Set Master Key
Parse.Cloud.useMasterKey()

// Routes
var routes = {
  core: require("cloud/express/routes/index"),
  auth: require("cloud/express/routes/auth"),
  feed: require("cloud/express/routes/feed"),
}

// Global app configuration section
app.set('views', 'cloud/express/views')
app.set('view engine', 'ejs')

app.enable('trust proxy')

app.use(express.bodyParser())
app.use(express.cookieParser())
app.use(express.cookieSession({
  secret: 'ursid',
  cookie: {
    httpOnly: true,
    maxAge: 604800000,
    proxy: true
  },
  rolling: true
}))
app.use(express.csrf())
app.use(function(req, res, next) {
  // Success Shorcut
  res.successT = function(data) {
    data = data || {}
    data.success = true
    res.json(data)
  }

  // Error Shorcut
  res.errorT = function(error) {
    if(typeof error != "string") {
      error = error.description || error.message || "An error occurred"
    }

    console.error(error)

    res.json({
      success: false,
      status: 1,
      message: error
    })
  }

  // Render Shorcut
  res.renderT = function(template, data) {
    // Tracking
    Parse.Analytics.track('pageView', {
      link: req.url,
      method: req.route.method
    })

    data = data || {}
    data.template = data.template || template
    data.user = data.user || req.session.user
    data.tutor = data.tutor || req.session.tutor
    res.render(template, data)
  }

  // Auth
  res.locals.csrf = req.session._csrf

  // Locals
  res.locals.host = req.session.host || ("http://" + req.host)
  res.locals.url = res.locals.host + req.url
  res.locals.user = req.session.user
  res.locals.itunesID = req.session.itunesID || ""
	res.locals.androidID = req.session.androidID || ""
	res.locals.androidURL = req.session.androidURL || ""
  res.locals.mixpanelToken = req.session.mixpanelToken || ""
  res.locals.random = random
  res.locals.config = {}
  res.locals.support = false

  if(req.session.appliedSettings !== true || !req.session.mixpanelToken) {
    Parse.Config.get().then(function(settings) {
	    req.session.appliedSettings = true
	    req.session.itunesID = settings.get("itunesId")
	    req.session.androidID = settings.get("androidId")
	    req.session.androidURL = settings.get("androidURL")
	    req.session.host = settings.get("host")
      req.session.mixpanelToken = settings.get("mixpanelToken")
	    
	    res.locals.host = req.session.host
      res.locals.itunesID = req.session.itunesID
	    res.locals.androidID = req.session.androidID
	    res.locals.androidURL = req.session.androidURL
      res.locals.mixpanelToken = req.session.mixpanelToken
      next()
    })
  } else {
    next()
  }
})
// Landing
app.get('/', routes.auth.login, routes.feed.home)
app.get('/press', routes.core.press)
app.get('/support', routes.core.support)

app.post('/sms', routes.core.sms)
app.post('/feed', routes.auth.login, routes.feed.feed)
app.post('/feed/voted', routes.auth.login, routes.feed.voted)
app.post('/feed/interest', routes.auth.login, routes.auth.interest)

// Terms & Privacy
app.get('/terms', routes.core.terms)
app.get('/privacy', routes.core.privacy)

// Robots
app.get('/robots', routes.core.robots)
app.get('/robots.txt', routes.core.robots)

// Sitemap
app.get('/sitemap', routes.core.sitemap)
app.get('/sitemap.xml', routes.core.sitemap)

// Not Found Redirect
app.all("*", routes.core.notfound)

// Listen to Parse
app.listen()
