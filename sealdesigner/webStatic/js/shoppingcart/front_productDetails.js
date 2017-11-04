$(function(){
})

////设置设置商品介绍和商品评价标签页的title的样式改变
//    $('#Ul_tab > li > a').click(function(e){
//        //阻止其a标签的链接发生
//        e.preventDefault();
//        //先把a标签的样式都设置成没有被选中时的样式
//        $('#Ul_tab > li > a').css({'background-color':'#ffffff','color':'#660000'});
//        //再设置被选中的a标签的样式
//        $(this).css({'background-color':'#660000','color':'#ffffff'});
//    });

$(function cut(){
    $(".introduce").show();
    $(".comments").hide();
})
$("body").on("click",".da-introduce",function(){
    $(".introduce").show();
    $(".comments").hide();
})
$("body").on("click",".da-comments",function(){
    $(".introduce").hide();
    $(".comments").show();
})