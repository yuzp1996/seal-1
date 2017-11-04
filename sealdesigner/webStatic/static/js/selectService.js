/*
用户选择客服js
*/

//$(function(){
//    selectService();
//})

//function selectService(){
//    $.post("/chatroom/selectService/",function(data){
//        var str="";
//        if(data=="0"){
//            str+="<li>客服下线</li>"
//        }else{
//            var jsonData = $.parseJSON(data);
//            var j=1;
//            for(var i in jsonData){
//                str+="<li><a href='/chatroom/contactservice?serviceId="+jsonData[i].serviceId+"'>客服（"+j+" )</a></li>";
//                j=j+1;
//            }
//        }
//        $(".nav-list-item-ul").empty().append(str);
//    })
//}
//
//$("body").on("click",".chatService",function(){
//    selectService();
//})
//$("body").on("click",".chatService",function(){
//     alert("123");
//     $("#deleteOneStudentTip").fadeIn(200);
//     $("#pictureid").val($(this).attr("id"));
//     $("#putplace").val($(this).attr("place"));
//     $("#bg").css({
//            display: "block", height: $("#content").height()
//        });
//        var $box = $('.box');
//        $box.css({
//            //设置弹出层距离左边的位置
//            left: ($("body").width() - $box.width()) / 2 + 120 + "px",
//            //设置弹出层距离上面的位置
//            top: ($(window).height() - $box.height()) / 4 + $(window).scrollTop() + "px",
//            display: "block"
//        });
//})
//$("body").on("click",".chatService",function(){
//    alert("22");
//    $(".doubleClick").attr({
//        "href":"#modal-container-666",  //追加属性
//        "data-toggle":"modal",
//    }).click();
//
//})