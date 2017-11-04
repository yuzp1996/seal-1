$(document).ready(function(){
	$("#select1 dd").click(function () {
		$(this).addClass("selected").siblings().removeClass("selected");
		if ($(this).hasClass("select-all")) {
			$("#selectA").remove();
		} else {
			var copyThisA = $(this).clone();
			if ($("#selectA").length > 0) {
				$("#selectA a").html($(this).text());
			} else {
				$(".select-result dl").append(copyThisA.attr("id", "selectA"));
			}
		}
	});

	$("#select2 dd").click(function () {
		$(this).addClass("selected").siblings().removeClass("selected");
		if ($(this).hasClass("select-all")) {
			$("#selectB").remove();
		} else {
			var copyThisB = $(this).clone();
			if ($("#selectB").length > 0) {
				$("#selectB a").html($(this).text());
			} else {
				$(".select-result dl").append(copyThisB.attr("id", "selectB"));
			}
		}
	});

	$("#select3 dd").click(function () {
		$(this).addClass("selected").siblings().removeClass("selected");
		if ($(this).hasClass("select-all")) {
			$("#selectC").remove();
		} else {
			var copyThisC = $(this).clone();
			if ($("#selectC").length > 0) {
				$("#selectC a").html($(this).text());
			} else {
				$(".select-result dl").append(copyThisC.attr("id", "selectC"));
			}
		}
	});

	$(function()
	{	$("#all").css({"background-image":"linear-gradient(#599BDC, #3072B3)",
		"color":"#fff"});
		if ($(this).css("background-image","linear-gradient(#F4F4F4, #ECECEC)")) {
		$(".sort1").click(function()
			{
				$(".sort1").css({

					"background-image":"linear-gradient(#F4F4F4, #ECECEC)",
					"color":"#333"
				});
				$(this).css("background-image","linear-gradient(#599BDC, #3072B3)");
				$(this).css("color","#fff");
			});
	};

	});

	$("#selectA").live("click", function () {
		$(this).remove();
		$("#select1 .select-all").addClass("selected").siblings().removeClass("selected");
	});

	$("#selectB").live("click", function () {
		$(this).remove();
		$("#select2 .select-all").addClass("selected").siblings().removeClass("selected");
	});

	$("#selectC").live("click", function () {
		$(this).remove();
		$("#select3 .select-all").addClass("selected").siblings().removeClass("selected");
	});
	$(".select dd").live("click", function () {
		if ($(".select-result dd").length > 1) {
			$(".select-no").hide();
		} else {
			$(".select-no").show();
		}
	});

});