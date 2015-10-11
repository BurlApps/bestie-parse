(function ($) {
$.fn.vAlign = function(position) {
	return this.each(function(i){
    	var h = $(this).height();
    	var oh = $(this).outerHeight();
    	var mt = (h + (oh - h)) / 2;
    	$(this).css("margin-top", "-" + mt + "px");
    	$(this).css("top", "50%");
    	$(this).css("position", (position) ? position : "absolute");
	});
};
})(jQuery);

(function ($) {
$.fn.hAlign = function(position) {
	return this.each(function(i){
    	var w = $(this).width();
    	var ow = $(this).outerWidth();
    	var ml = (w + (ow - w)) / 2;
    	$(this).css("margin-left", "-" + ml + "px");
    	$(this).css("left", "50%");
    	$(this).css("position", (position) ? position : "absolute");
	});
};
})(jQuery);

/*! Morphext - v2.4.5 - 2015-08-26 */!function(a){"use strict";function b(b,c){this.element=a(b),this.settings=a.extend({},d,c),this._defaults=d,this._init()}var c="Morphext",d={animation:"bounceIn",separator:",",speed:2e3,complete:a.noop};b.prototype={_init:function(){var b=this;this.phrases=[],this.element.addClass("morphext"),a.each(this.element.text().split(this.settings.separator),function(c,d){b.phrases.push(a.trim(d))}),this.index=-1,this.animate(),this.start()},animate:function(){this.index=++this.index%this.phrases.length,this.element[0].innerHTML='<span class="animated '+this.settings.animation+'">'+this.phrases[this.index]+"</span>",a.isFunction(this.settings.complete)&&this.settings.complete.call(this)},start:function(){var a=this;this._interval=setInterval(function(){a.animate()},this.settings.speed)},stop:function(){this._interval=clearInterval(this._interval)}},a.fn[c]=function(d){return this.each(function(){a.data(this,"plugin_"+c)||a.data(this,"plugin_"+c,new b(this,d))})}}(jQuery);