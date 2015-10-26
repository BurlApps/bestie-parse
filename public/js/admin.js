$(function() {
	$(".container").show()
	
	if($(".batch").length > 0) {
		$(".loading").hide()
	} else {
		$(".loading").text("No new batches...")
		reloadPage()
	}
	
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
		
		var form = $(this).slideUp(200)
		
		$.post("/admin/batch", form.serialize())
		
		setTimeout(function() {
			if($(".batch:visible").length == 0) {
				$(".loading").text("No new batches...")
				reloadPage()
			}
		}, 250)
	})
})

function reloadPage() {
	setTimeout(function() {
		window.location.reload()
	}, 30000)
}