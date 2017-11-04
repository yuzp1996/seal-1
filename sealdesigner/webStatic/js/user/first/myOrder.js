/*
    我的订单
*/
$(function(){
    $.cookie("page",1);
    $.ajaxSetup({
          async : false
        });
    $(".selectOrder").val(0);
    orderList($(".selectOrder").val());//加载订单列表

})

/* 分 页 */
$("body").on("click",".pageNum",function(){
    if ( $.cookie("page")!=$(this).html()){  //判断点击的不是当前页
            $.cookie("page",$(this).html());
    }
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    orderList($(".selectOrder").val());
})
/*上一页*/
$("body").on("click",".pageUp",function(){
    var num = $.cookie("page");
    $.cookie("page",num-1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    orderList($(".selectOrder").val());
})

/*下一页*/
$("body").on("click",".pageDown",function(){
    var num = parseInt($.cookie("page"));
    $.cookie("page",num+1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    orderList($(".selectOrder").val());
})

/*按处理状态查询*/
$("body").on("change",".selectOrder",function(){
        var orderState = $(this).val();
        orderList(orderState);  //调用函数，并传一个参数
});

/* 加载订单列表*/
function orderList(orderState){
    var jsonStr={};
    jsonStr = $.extend({},jsonStr,{"orderState":orderState});
    jsonStr = $.extend({},jsonStr,{"page":$.cookie("page")});
    $.post("/Users/getOrderList",jsonStr,function(data){
        var str="";
        if(data=="0"){
            str+="<div style='text-align:center;margin-top:100px;font-size:18px'>暂无订单</div>"
            $(".list").empty().append(str);
        }else{
            var jsonData = $.parseJSON(data);
            for(var i in jsonData){
                str+="<table class='orderList-details'><tr class='orderBody'><td colspan='8'><span class='orderBody1'><h4>"+jsonData[i].orderDate+"</h4></span><span class='orderBody2'><h5>订单号："+jsonData[i].orderId+"</h5></span>";
                var orderState=parseInt(jsonData[i].orderState);
                if(orderState==5||orderState==8||orderState==11){
                    str+="<a class='delete'id="+jsonData[i].orderId+"><span class='orderBody3 icon-trash'></span></a></td></tr>";
                }else{
                    str+="</td></tr>";
                }
                var materialNum=parseInt(jsonData[i].material.length);
                if(materialNum>=1){
                var price=0
                    for (j=0;j<materialNum;j++)
                         {
                         price=price+parseInt(jsonData[i].material[j].payPrice)
                         }
                    price=parseFloat(price).toFixed(2);
                }

                str+="<tbody><tr class='orderContent'><th class='orderContent content1'><div class='picture'><img class='picture-img'src="+jsonData[i].material[0].picture+"/></div><div style='margin:6% 0% 0% 10%;'><a class='content1-1'href='/ShoppingCart/productDetails?materialId="+jsonData[i].material[0].materialId+"'>"+jsonData[i].material[0].materialName+"</a><br><h>颜色："+jsonData[i].material[0].color+"</h><br><h>字体："+jsonData[i].material[0].font+"</h></div></th>";
                str+="<th class='orderContent content2'><center>"+jsonData[i].material[0].number+"</center></th><th class='orderContent content2'><center>￥"+jsonData[i].material[0].payPrice+"</center></th>";
                str+="<th class='orderContent content2'><center>￥"+price+"</center></th><th class='orderContent content2'><center>"+jsonData[i].payName+"</center></th>";
                if(jsonData[i].isPaid){
                    str+="<th class='orderContent content2'><center>已付款</center></th>";
                }else{
                    str+="<th class='orderContent content2'><center>未付款</center></th>";
                }
                if(jsonData[i].orderState=="-1"){
                    str+="<th class='orderContent content2'><center style='color:red;'>返回修改</center></th>";
                }else if(jsonData[i].orderState=="1"){
                    str+="<th class='orderContent content2'>等待接单<center></center></th>";
                }else if(jsonData[i].orderState=="2"){
                    str+="<th class='orderContent content2'><center>资料审核</center></th>";
                }else if(jsonData[i].orderState=="3"){
                    str+="<th class='orderContent content2'><center>交付制作</center></th>";
                }else if(jsonData[i].orderState=="4"){
                    str+="<th class='orderContent content2'><center>待收货</center></th>";
                }else if(jsonData[i].orderState=="5"){
                    str+="<th class='orderContent content2'><center>已收货</center></th>";
                }else if(jsonData[i].orderState=="8"){
                    str+="<th class='orderContent content2'><center>交易完成</center></th>";
                }else if(jsonData[i].orderState=="9"){
                    str+="<th class='orderContent content2'><center>等待退款</center></th>";
                }else if(jsonData[i].orderState=="10"){
                    str+="<th class='orderContent content2'><center>退款中</center></th>";
                }else if(jsonData[i].orderState=="11"){
                    str+="<th class='orderContent content2'><center>退款成功</center></th>";
                }
                str+="<th class='orderContent content3'><center><a href='/Users/myOrder?orderId="+jsonData[i].orderId+"&orderState="+jsonData[i].orderState+"'>订单详情</a><br>";
                if(orderState<=2){
                    str+="<a class='cancel'id="+jsonData[i].orderId+">取消订单</a><br>";
                }
                if(orderState==4){
                    str+="<input type='button' class='receive' id="+jsonData[i].orderId+" value='确认收货'/>";
                }
                if(orderState==5||orderState==8){
                    if(jsonData[i].material[0].isComment){
                        str+="<a href='/Users/orderEvaluate?materialId="+jsonData[i].material[0].materialId+"&trollerId="+jsonData[i].material[0].trollerId+"'>我的评价</a>";
                    }else{
                        str+="<a href='/Users/orderEvaluate?materialId="+jsonData[i].material[0].materialId+"&trollerId="+jsonData[i].material[0].trollerId+"'><input type='button' class='evaluate' id="+jsonData[i].material[0].materialId+" value='评价'/></a>";
                    }
                }
                str+="</center></th></tr></tbody>";
                var materialNum=parseInt(jsonData[i].material.length);
                if(materialNum>1){
                    for (j=1;j<materialNum;j++)
                    {
                        str+="<tbody><tr class='orderContent'><th class='orderContent content1'><div class='picture'><img class='picture-img'src="+jsonData[i].material[j].picture+"/></div><div style='margin:6% 0% 0% 10%;'><a class='content1-1'href='/ShoppingCart/productDetails?materialId='"+jsonData[i].material[j].materialId+">"+jsonData[i].material[j].materialName+"</a><br><h>颜色："+jsonData[i].material[j].color+"</h><br><h>字体："+jsonData[i].material[j].font+"</h></div></th>";
                        str+="<th class='orderContent content2'><center>"+jsonData[i].material[j].number+"</center></th><th class='orderContent content2'><center>￥"+jsonData[i].material[j].payPrice+"</center></th>";
                        str+="<th class='orderContent content2'></th><th class='orderContent content2'></th><th class='orderContent content2'></th><th class='orderContent content2'></th><th class='orderContent content3'>";
                        if(orderState==5||orderState==8){
                            if(jsonData[i].material[j].isComment){
                                str+="<center><a href='/Users/orderEvaluate?materialId="+jsonData[i].material[j].materialId+"&trollerId="+jsonData[i].material[j].trollerId+"'>我的评价</a></center>"
                            }else{
                                str+="<center><a href='/Users/orderEvaluate?materialId="+jsonData[i].material[j].materialId+"&trollerId="+jsonData[i].material[j].trollerId+"'><input type='button' value='评价' class='evaluate'id="+jsonData[i].material[j].materialId+"/></a></center>";
                            }
                        }
                        str+="</th></tr></tbody>"
                    }
                }
                str+="</table>"
                $(".list").empty().append(str);
                $.cookie("pageCount",jsonData[0].pageNum);
                if (jsonData[0].pageNum!=0){
                    $(".page").empty().append(pageJs(jsonData[0].pageNum,5));    //加载分页列表
                }
            }
        }
    })
}
/*点击删除按钮*/
$("body").on("click",".delete",function(){
    if(confirm("确定要删除该条数据吗？")){
        $.post("/Users/deleteOrder",{"orderId":$(this).attr("id")},function(data){
            if(data=="1"){
                alert("删除成功");
            }else{
                alert("删除失败")
            }
        });
    }else{
        return false;
    }
    orderList($(".selectOrder").val());
})



/*点击取消订单按钮*/
$("body").on("click",".cancel",function(){
    if(confirm("确定取消该订单吗？")){
        $.post("/Users/cancelOrder",{"orderId":$(this).attr("id")},function(data){
            if(data=="1"){
                alert("取消成功");
                window.location.reload();
            }else{
                alert("取消失败");
            }
        });
    }else{
        return false;
    }
    orderList($(".selectOrder").val());
})

/*点击确认收货*/
$("body").on("click",".receive",function(){
    $.ajaxSetup({
	  async :false                   //同步更新;
	});
    if(confirm("是否确认收货？")){
    $.post("/Users/takeGoods",{"orderId":$(this).attr("id")},function(data){
        if(data=="1"){
            alert("收货成功");
            window.location.reload(true);
        }
    })
    }else{
        return false;
    }
})
///*点击评论按钮*/
//$("body").on("click",".evaluate",function(){
//    window.location.href="/Users/orderEvaluate?materialId="+$(this).attr("id");
//})