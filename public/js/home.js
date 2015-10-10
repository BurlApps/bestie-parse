var VotingRoom = function VotingRoom() {
	
	// jQuery
  this.$window = $(window)
  this.$body = $("body")
  this.$header = $(".header")
  this.$footer = $(".footer")
  this.$cards = $(".cards")
	
	// Initalize
  this.init()	
}

VotingRoom.prototype.init = function() {
	this.centerCards()
  this.bindEvents()
}

VotingRoom.prototype.bindEvents = function() {

}

VotingRoom.prototype.centerCards = function() {
	this.$cards.vAlign().hAlign()
	this.$cards.find(".vs").vAlign().hAlign()
}

// Initalization
$(function() {
  window.votingRoom = new VotingRoom()
})