$(function(){
    $.cookie("page",1);       //默认当前页数为1
    getAdminName();            //右上角管理员信息
    getCommodity();            //打印商品列表

    if ($("#action").val()=="look")
       look();
    else if($("#action").val()=="change")
       change();

})


/* 分 页 */
$("body").on("click",".pageNum",function(){
    if ( $.cookie("page")!=$(this).html()){  //判断点击的不是当前页
            $.cookie("page",$(this).html());
    }
    $(".page").empty().append(pageJs($.cookie("pageCount"),15));
    getCommodity();
})
/*上一页*/
$("body").on("click",".pageUp",function(){
    var num = $.cookie("page");
    $.cookie("page",num-1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),15));
    getCommodity();
})

/*下一页*/
$("body").on("click",".pageDown",function(){
    var num = parseInt($.cookie("page"));
    $.cookie("page",num+1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),15));
    getCommodity();
})


/*获取管理员帐号，显示与右上角*/
function getAdminName(){
    $.post("/Seal/getAdminName",function(data){
        var str=data;
        $("#adminName").append(str);
    })
}




/*打印商品管理列表*/
function getCommodity(jsonStr){
    jsonStr = $.extend({},jsonStr,{"page":$.cookie("page")});
    $.post("/Seal/getGoods",jsonStr,function(data){
        var str = "";
        var jsonData=$.parseJSON(data);
        for (var i in jsonData){
            if (jsonData[i].is==false)
                jsonData[i].is="不启用"
            else
                jsonData[i].is="启用"
            if (jsonData[i].isSecommendation==false)
                jsonData[i].isSecommendation="不推荐"
            else
                jsonData[i].isSecommendation="推荐"
            str += "<tr><td>"+jsonData[i].name+"</td><td>"+jsonData[i].quality+"</td><td>"+jsonData[i].price+"</td><td>"+jsonData[i].remainder+"</td><td>"+jsonData[i].isSecommendation+"</td><td>"+jsonData[i].is+"</td><td><a href='inFor?way=look&id="+jsonData[i].id+"'><i class='icon-eye-open' title='查看'/>查看&nbsp&nbsp&nbsp&nbsp</a><a href='inFor?way=change&id="+jsonData[i].id+"&pictureUrl="+jsonData[i].picture+"'><i class='icon-edit' title='管理'/>管理 </a></td></tr>"
        }
        $("#commoditylist").empty().append(str);
        $.cookie("pageCount",jsonData[0].num);
        if (jsonData[0].num!=0){
            $(".page").empty().append(pageJs(jsonData[0].num,15));    //加载分页列表
        }
    })
}
