/*
订单详情页

*/

$(function(){
    lookOrder();
    orderDetailAddress();
})



function lookOrder(){
    $.post("/Users/lookOrder",{"orderId":$(".orderId").val()},function(data){
        var jsonData=$.parseJSON(data);
        var str="";
        for( var i in jsonData){
           if (jsonData[i].parentName=="其他"){
               var mateClass="0";
//                   0代表为其他类
            }else{
               var mateClass="1";
//                   1代表印章
            }
            if (jsonData[i].orderState==-1){
               var strState="查看修改";
            }else{
               var strState="查看详情"
            }
            str+="<div class='body-content'><div class='body-left'><div class='body-picture'><img src="+jsonData[i].picture+" class='pictureAmg'/></div></div>"
            str+="<div class='body-right'><div class='right-content'><ul><li><span>商品：</span><span style='text-align:left;'>"+jsonData[i].materialName+"</span><span_right>数量："+jsonData[i].num+"</span_right></li><li><span>商品类型：</span><span style='text-align:left;'>"+jsonData[i].sealName+"</span><span_right>单价：￥"+jsonData[i].prince+"</span_right></li><li><span>颜色：</span><span style='text-align:left;'>"+jsonData[i].color+"</span><span_right>字体："+jsonData[i].font+"</span_right></li></ul></div>"
            //<p style='float:right;'>(查看订单详情)</p><a href='../ShoppingCart/trolleyInfoLoad?trolleyId="+jsonData[i].trolleyId+"&mateClass="+mateClass+"'class='backShopping' style='float:right;'>返回购物车</a></div></div>"
            if(mateClass=="0"){
                str+="</div></div></div>";
            }else{
               str+="<a href='../ShoppingCart/_trolleyInfoLoad?trolleyId="+jsonData[i].trolleyId+"&orderState="+jsonData[i].orderState+"'class='backShopping'  style='float:right;'>"+strState+"</a></div></div>";
            }
            $(".goods").empty().append(str);
        }
        $(".a").html(jsonData[0].createTime);
        $(".b").html(jsonData[0].changeTime);
        $(".c").html(jsonData[0].payName);
        if(jsonData[0].orderState=="-1"){
                $(".d").html("返回修改");
                $(".d").css("color","red");
            }else if(jsonData[0].orderState=="1"){
                $(".d").html("等待接单");
            }else if(jsonData[0].orderState=="2"){
                $(".d").html("资料查核");
            }else if(jsonData[0].orderState=="3"){
                $(".d").html("交付制作");
            }else if(jsonData[0].orderState=="4"){
                $(".d").html("待收货");
            }else if(jsonData[0].orderState=="5"){
                $(".d").html("已收货");
            }else if(jsonData[0].orderState=="8"){
                $(".d").html("交易完成");
            }else if(jsonData[0].orderState=="9"){
                $(".d").html("等待退款");
            }else if(jsonData[0].orderState=="10"){
                $(".d").html("退款中");
            }else if(jsonData[0].orderState=="11"){
                $(".d").html("退款成功");
                $(".d").css("color","red");
            }
        if(jsonData[0].orderState<="3"){
            $(".manage").css("display","block");
        }else{
            $(".manage").css("display","none");
        }
        if(jsonData[0].orderState=="4"){
            $(".take-goods").css("display","block");
        }
        $(".e").html(jsonData[0].privilege);
        $(".f").html(jsonData[0].totalPrince);

        if(jsonData[0].orderRemark==null){
            $(".remark").val("无");
        }else{
            $(".remark").val(jsonData[0].orderRemark);
        }
        if(jsonData[0].responseMessage==null){
            $(".feedback").text("无");
        }else{
            if(jsonData[0].orderState=="-1"){
                $(".feedback").css("color","red")
                $(".feedback").text(jsonData[0].responseMessage);
            }else{
            $(".feedback").text(jsonData[0].responseMessage);
            }
        }
    })
}

function orderDetailAddress(){
    $.post("/Users/orderDetailAddress",{"orderId":$(".orderId").val()},function(data){
        var jsonData=$.parseJSON(data);
        $(".people").html(jsonData[0].addPeople);
        $(".address").html(jsonData[0].provinceName+jsonData[0].areaName+jsonData[0].addInfor);
        $(".phone").html(jsonData[0].addPhone);
        $(".manage").attr("id",jsonData[0].addId);

    })

}
/*修改地址*/
$("body").on("click",".manage",function(){
    $(".doubleClick").attr({
        "href":"#modal-container-666",  //追加属性
        "data-toggle":"modal",
    }).click();

})


/*点击返回*/
$("body").on("click",".button-back",function(){
//    window.history.back(-1);
    window.location.href="/Users/myOrder";//要重新加载一下页面。
})

/*点击确认收货*/
$("body").on("click",".take-goods",function(){
    $.ajaxSetup({
	  async :false                   //同步更新;
	});
    if(confirm("是否确认收货？")){
    $.post("/Users/takeGoods",{"orderId":$(".orderId").val()},function(data){
        if(data=="1"){
            alert("收货成功");
            window.location.reload(true);
        }
    })
    }else{
        return false;
    }
})