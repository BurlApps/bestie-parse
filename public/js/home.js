var VotingRoom = function VotingRoom() {
	
	// jQuery
  this.$window = $(window)
  this.$body = $("body")
  this.$header = $(".header")
  this.$footer = $(".footer")
  this.$cards = $(".cards")
  this.$card1 = $(".card.left")
  this.$card2 = $(".card.right")
	
	// Variables
	this.cards = []
	this.loaded = false
	
	// Initalize
  this.init()	
}

VotingRoom.prototype.init = function() {
	this.centerCards()
  this.bindEvents()
  this.getCards()
}

VotingRoom.prototype.bindEvents = function() {
	this.$card1.click(this.cardSelected.bind(this, this.$card1))
	this.$card2.click(this.cardSelected.bind(this, this.$card2))
	this.$window.keydown(this.keyPressed.bind(this))
}

VotingRoom.prototype.centerCards = function() {
	this.$cards.vAlign().hAlign()
	this.$cards.find(".vs").vAlign().hAlign()
}

VotingRoom.prototype.keyPressed = function(e) {		
	if([65, 49, 87, 37, 38].indexOf(e.keyCode) > -1) {
		this.cardSelected(this.$card1)
	}
	
	if([68, 50, 83, 39, 40].indexOf(e.keyCode) > -1) {
		this.cardSelected(this.$card2)
	}
}

VotingRoom.prototype.cardSelected = function($card) {
	var _this = this
	var winner = $card.attr("data-id")
	var oneID = _this.$card1.attr("data-id")
	var twoID = _this.$card2.attr("data-id")
	
	$card.addClass("active")
	
	_this.loaded = false
	_this.$card1.addClass("results")
	_this.$card2.addClass("results")
	
	setTimeout(function() {
		$card.removeClass("active")
	}, 100)
	
	setTimeout(function() {
		_this.$card1.addClass("results")
		_this.$card2.addClass("results")
		
		if(_this.cards.length > 0) 
			_this.loadCards()
	}, 500)
	
	if(this.cards.length < 5) 
		_this.getCards()
		
	$.post("/feed/voted", {
		_csrf: config.csrf,
		winner: winner == oneID ? oneID : twoID,
		looser: winner != oneID ? oneID : twoID
	})
}

VotingRoom.prototype.getCards = function() {
	var _this = this
	
	$.post("/feed", {
		_csrf: config.csrf
	}, function(cards) {
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
			'background-image': "url('" + card.image + "')"
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