
$(function(){
    $.cookie("page",1);       //默认当前页数为1
    var total = $("#total").val();
    $(".page").empty().append(pageJs(total,15));
});

/*数据库调取分页*/
/* 分 页 */
$("body").on("click",".pageNum",function(){
    if ( $.cookie("page")!=$(this).html()){  //判断点击的不是当前页
        $.cookie("page", $(this).html());
    }
    var nextPageNum = $(this).html()
    $(".page").empty().append(pageJs($("#total").val(),15));
    window.location.href = "newsList?page=" + nextPageNum;
});
/*上一页*/
$("body").on("click",".pageUp",function(){
    var num = $.cookie("page");
    var nextPageNum = num -1;
    $.cookie("page",nextPageNum);
    $(".page").empty().append(pageJs($("#total").val(),15));
    window.location.href = "newsList?page=" + nextPageNum;
});

/*下一页*/
$("body").on("click",".pageDown",function(){
    var num = parseInt($.cookie("page"));
    var nextPageNum = num + 1;
    $.cookie("page",nextPageNum);
    $(".page").empty().append(pageJs($("#total").val(),15));
    window.location.href = "newsList?page=" + nextPageNum;
});
