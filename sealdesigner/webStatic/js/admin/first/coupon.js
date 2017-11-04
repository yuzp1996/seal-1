

/***************优惠劵页面****************/

/*数据库分页*/
$(function getPage(){
    var page = $("#page").val();
    var allPricilegeTypeTotal = $("#allPricilegeTypeTotal").val();
    $(".page").empty().append(pageJs(allPricilegeTypeTotal,10));    //加载分页列表
})
/* 分 页 */
$("body").on("click",".pageNum",function(){
    if ( $.cookie("page")!=$(this).html()){  //判断点击的不是当前页
            $.cookie("page",$(this).html());
            var pageNum = $(this).html();
            $(".pageNum ").attr("href","coupon?pageNum="+pageNum);   // 点击过后添加一个连接
    }
})
/*上一页*/
$("body").on("click",".pageUp",function(){
    var num = $.cookie("page");
    $.cookie("page",num-1);
    var pageNum = $.cookie("page");
    $(".pageUp ").attr("href","coupon?pageNum="+pageNum);  // 点击过后添加一个连接
})

/*下一页*/
$("body").on("click",".pageDown",function(){
    var num = parseInt($.cookie("page"));
    $.cookie("page",num+1);
    var pageNum = $.cookie("page");
    $(".pageDown ").attr("href","coupon?pageNum="+pageNum);      // 点击过后添加一个连接
})



/*添加优惠券初始化设置*/
$("body").on("click","#couponAdd",function(){
    $(".privilegeName").val("");
    $(".privilegePrice").val("");
    $(".privilegeAll").val("");
    $(".some_class").val("");
    $(".total").val("");
})

/*删除优惠劵*/
$("body").on("click",".pricilegeTypeDelete",function(){
    if(confirm("确认删除该优惠劵？")){
        var privilegeTypeId = $(this).attr("id");
        $.post("/Seal/privilegeDelete",{"privilegeTypeId":privilegeTypeId},function(data){
            if(data==1){
                alert("删除成功！");
                window.location.reload(true);
            }else{
                alert("删除失败，请稍后再试！");
            }
        })
    }
})

/*点击保存优惠劵*/
$("body").on("click",".btn-primary",function(){
    var jsonStr = {};
    if($(".privilegeName").val()==""){
        alert("请输入优惠券名称！");
        return;
    }
    if($(".privilegePrice").val()==""){
        alert("请输入优惠劵价格!");
        return;
    }
    if($("#some_class_1").val()==""){
        alert("请输入优惠劵开始时间！");
        return;
    }
    if($("#some_class_2").val()==""){
        alert("请输入优惠券过期时间！");
        return;
    }
    if($(".privilegeAll").val()==""){
        alert("请输入使用该优惠卷所要满足的条件！");
        return;
    }
    if($(".total").val()==""){
        alert("请输入发放总量！");
        return;
    }
    var total = $(".total").val();
    var privilegeName = $(".privilegeName").val();   //优惠券名称
    var privilegePrice = $(".privilegePrice").val();  // 优惠券价格
    jsonStr = $.extend({},jsonStr,{"privilegeName":privilegeName},{"privilegePrice":privilegePrice},{"total":total});
    /*判断价钱格式*/
    var priceFormat = /^([1-9]\d*|0|)\.\d{2}$/
     if(!priceFormat.test(privilegePrice)){
        //调用函数设置价钱格式
        privilegePrice = priceFormatAll(privilegePrice);
        $(".privilegePrice").empty().append(privilegePrice);
     }
    var privilegeStart = $("#some_class_1").val()  // 优惠劵开始时间
    var privilegePast = $("#some_class_2").val()  // 优惠劵过期时间
    if(!checkEndTime()){
        alert("结束时间必须晚于开始时间！");
        return;
    }
    var privilegeAll = $(".privilegeAll").val();   // 优惠卷所要满足的条件
    if(!priceFormat.test(privilegeAll)){
        //调用函数设置价钱格式
        var privilegePrice = privilegeAll
         privilegePrice = priceFormatAll(privilegePrice);
        $(".privilegeAll").empty().append(privilegePrice);
    }
    jsonStr = $.extend({},jsonStr,{"privilegeStart":privilegeStart},{"privilegePast":privilegePast},{"privilegeAll":privilegeAll});
    $.post("/Seal/savePrivilege",jsonStr,function(data){
        if(data==1){
            alert("保存成功！");
            window.location.reload();
            return;
        }
        else{
            alert("保存失败，请稍后再试！");
            return;
        }
    })
})

/*设置价钱格式统一为保存两位小数*/
function priceFormatAll(privilegePrice){
    c = String(privilegePrice).split(".",2)  // 保留小数点后两位
    if (c[1]==undefined){
        privilegePrice = privilegePrice + ".00";
    }else {
       if (c[1].length<2){
        privilegePrice = privilegePrice + "0";
        }
    }
    return privilegePrice
}


/*判断日期大小*/
function checkEndTime(){
    var startTime=$("#some_class_1").val();
    var start=new Date(startTime.replace("-", "/").replace("-", "/"));
    var endTime=$("#some_class_2").val();
    var end=new Date(endTime.replace("-", "/").replace("-", "/"));
    if(end<start){
        return false;
    }
    return true;
}

