$(function() {
	$(".loading").hide()
	$(".container").show()
	
	$(".input").blur(function() {
		var ele = $(this)
		var val = ele.val().match(/-?\d+/).join("")
		var number = Number(val)
		
		number = Math.max(0, number)
		number = Math.min(100, number)
		
		if(val[val.length - 1] != "%")
			ele.val(number + "%")
		
		$(this).parents(".group")
			.find(".percent").val(number/100)
	})
	
	$(".batch").submit(function(e) {
		e.preventDefault()
		e.stopPropagation()
		
		var form = $(this).slideUp()
		
		$.post("/admin/batch", form.serialize())
	})
})