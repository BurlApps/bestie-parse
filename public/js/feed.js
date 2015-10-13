var VotingRoom = function VotingRoom() {
	
	// jQuery
  this.$window = $(window)
  this.$body = $("body")
  this.$header = $(".header")
  this.$footer = $(".footer")
  this.$cards = $(".cards")
  this.$card1 = $(".card.left")
  this.$card2 = $(".card.right")
  this.$spinner = $(".spinner")
  this.$interests = $(".interests")
  this.$maleInterest = $(".interests .male")
  this.$femaleInterest = $(".interests .female")
  this.$form = $(".form")
  this.$input = $(".form .input")
  this.$button = $(".form .button")
	
	// Variables
	this.cards = []
	this.loaded = false
	this.locked = false
	
	// Initalize
  this.init()	
}

VotingRoom.prototype.init = function() {
	this.centerCards()
  this.bindEvents()
  this.getCards()
  this.morphText()
}

VotingRoom.prototype.bindEvents = function() {
	this.$card1.click(this.cardSelected.bind(this, this.$card1))
	this.$card2.click(this.cardSelected.bind(this, this.$card2))
	this.$maleInterest.click(this.interestSelected.bind(this, "male"))
  this.$femaleInterest.click(this.interestSelected.bind(this, "female"))
  this.$form.submit(this.formSubmitted.bind(this))
	this.$window.keydown(this.keyPressed.bind(this))
}

VotingRoom.prototype.formSubmitted = function(e) {
	e.preventDefault()
	e.stopPropagation()
	
	var _this = this
	var message = this.$form.find(".message").fadeOut(200)
	
	$.post("/sms", {
		_csrf: config.csrf,
		number: this.$input.val()
	}, function(res) {
		if(res.success) {
			mixpanel.track("Web.SMS.Sent")
			
			message.fadeIn(200)
			_this.$input.val("")
		} else {
			alert(res.message)
		}
	})
}

VotingRoom.prototype.morphText = function() {
	$(".js-rotating").Morphext({
		animation: "flipInX",
		speed: 3000,
		separator: ","
	})
}

VotingRoom.prototype.centerCards = function() {
	this.$cards.find(".vs").vAlign().hAlign().show()
	this.$spinner.vAlign().hAlign()
}

VotingRoom.prototype.keyPressed = function(e) {
	if(this.$input.is(":focus")) return true
	
	if(37 == e.keyCode)
		this.cardSelected(this.$card1)
	
	else if(39 == e.keyCode)
		this.cardSelected(this.$card2)

}

VotingRoom.prototype.interestSelected = function(gender) {
	var _this = this
	
	this.$interests.removeClass("male female")
	this.$interests.addClass(gender)
	
	this.$spinner.show()
	
	_this.$card1.css({
		"background-image": "",
		"opacity": 0.1
	})
	
	_this.$card2.css({
		"background-image": "",
		"opacity": 0.1
	})
	
	$.post("/feed/interest", {
		_csrf: config.csrf,
		interest: gender
	}, function(res) {
		if(!res.success) 
			return alert("Failed to update :(")
			
			mixpanel.track("Web.User.Interest.Changed", {
				"Interested": gender
			})
		
		_this.cards = []
		_this.loaded = false
		_this.getCards()
	})
}

VotingRoom.prototype.cardSelected = function($card) {
	var _this = this
	var winner = $card.attr("data-id")
	var oneID = _this.$card1.attr("data-id")
	var twoID = _this.$card2.attr("data-id")
	
	if(_this.locked) return
		
	_this.loaded = false
	_this.locked = true
	
	$card.addClass("active")
	_this.$card1.addClass("results")
	_this.$card2.addClass("results")
	
	setTimeout(function() {
		$card.removeClass("active")
	}, 100)
	
	setTimeout(function() {
		_this.locked = false
		_this.$card1.addClass("results")
		_this.$card2.addClass("results")
		
		if(_this.cards.length > 0) {
			_this.loadCards()
		} else {
			_this.$spinner.show()
			_this.$card1.css("opacity", 0.1)
			_this.$card2.css("opacity", 0.1)
		}
		
		if(_this.cards.length < 5) 
			_this.getCards()
	}, 600)
			
	$.post("/feed/voted", {
		_csrf: config.csrf,
		winner: winner == oneID ? oneID : twoID,
		looser: winner != oneID ? oneID : twoID
	})
	
	mixpanel.track("Web.Set.Voted")
}

VotingRoom.prototype.getCards = function() {
	var _this = this
	
	if(!_this.loaded) {
		_this.$spinner.show()
		_this.$card1.css("opacity", 0.1)
		_this.$card2.css("opacity", 0.1)
	}
	
	$.post("/feed", {
		_csrf: config.csrf
	}, function(cards) {
		_this.$spinner.hide()
		_this.cards.push.apply(_this.cards, cards)
		
		if(cards.length >= 2 && !_this.loaded)
			_this.loadCards()
			
		cards.forEach(function(card) {
			_this.$body.append(
				$("<img/>")
					.addClass("hidden")
					.attr("src", card.image)
			)
		})
	})
}

VotingRoom.prototype.loadCards = function() {
	if(this.cards.length < 2) return
	
	this.formatCard(this.$card1, this.cards[0])
	this.formatCard(this.$card2, this.cards[1])
	
	this.cards.splice(0,2)
	this.loaded = true
}

VotingRoom.prototype.formatCard = function($card, card) {	
	$card
		.css({
			'background-image': "url('" + card.image + "')",
			"opacity": 1
		})
		.attr("data-id", card.id)
		.removeClass("results")
		.find(".results")
		.text(Math.round(card.percent * 100) + "%")
}

// Initalization
$(function() {
  window.votingRoom = new VotingRoom()
})