/*
管理员登录界面js
王志文
2016/1/8
*/
$(function(){
    $.post("/ShoppingCart/validate",function(data){
	    $("#indexcode").empty().append("<img id='imValidate'  src='data: image/gif;base64,"+data+"'/>");
	});
	$(".box_center tr td input").addClass("form-control")
})
$("body").on("click","#indexcode",function(){
    $.post("/ShoppingCart/validate",function(data){
	    $("#indexcode").empty().append("<img id='imValidate'  src='data: image/gif;base64,"+data+"'/>");
	});
})

$("body").on("mouseover",".login_butt",function(){
    $(this).css("color","#151512")
})

$("body").on("mouseleave",".login_butt",function(){
    $(this).css("color","#FFFFFF")
})