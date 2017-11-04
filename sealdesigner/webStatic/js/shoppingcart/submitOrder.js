
//预加载函数
$(function(){
//    alert($.cookie("userId")); //获取缓存中的用户id
//        $.ajaxSetup({
//          async : false     //ajax同步，默认为false异步
//        });
    $("input[name='coupon_radio']").attr("checked",false);   //刷新时设置为未选中状态
    $(".submitMessage").val("");  //刷新时留言设置为空
    submitAddressList();
    getPayStyle();
    trolleyLength();
})


/*点击“完成订单”*/
$("body").on("click",".button",function(){
    var jsonStr = {};
    var payId = $("#select").val();  //付款方式id
    var troller = $(".alter");  //购物车id
    var trollerId = "";
    var orderRemark = $(".submitMessage").val();  //备注
    var payPrice = $("#payPrice").html();   // 用户实际支付的价钱,td 中获取值
    for(var i=0;i<troller.length;i++){   // 一个订单多个商品时，把商品的id用！号分隔开
        trollerId += troller.eq(i).val();
        if(i<troller.length-1){
            trollerId = trollerId + "!";
        }
    }
    jsonStr = $.extend({},jsonStr,{"payId":payId},{"trollerId":trollerId},{"orderRemark":orderRemark},{"payPrice":payPrice});
    if($("#invoice_choice").attr("checked")){   //判断是否开具发票
        var invoice_choice_head = $(".invoice_choice_head").val();
        if(invoice_choice_head==""){
            alert("请输入发票抬头！");
            return;
        }
        var invoiceHead = $(".invoice_choice_head").val();   //发票抬头
        var isInvoice = 1;  //是否开具发票
        var isInvoiceDetails = $(".invoicing_select").val();  //发票明细
        jsonStr = $.extend({},jsonStr,{"invoiceHead":invoiceHead},{"isInvoiceDetails":isInvoiceDetails},{"isInvoice":isInvoice});
    }else{
        var isInvoice = 0;
        jsonStr = $.extend({},jsonStr,{"isInvoice":isInvoice});
    }

    var addId = $("input[name='choseAddress']:checked").attr("id"); //收货地址——获取被选中radio的值
    if(addId==undefined){
        alert("请添加或选择您的收货地址！");
        return;
    }
    var privilegeId = $("input[name='coupon_radio']:checked").attr("id");  //优惠券——被选中的radio的值
    jsonStr = $.extend({},jsonStr,{"addId":addId},{"privilegeId":privilegeId});
    $.post("/ShoppingCart/saveOrder",jsonStr,function(data){
        if(data==1){
            alert("提交订单成功！");
            window.location.href="/Users/personalCenter";   // 页面跳转
        }else if(data==2){
            alert("资料填写不完整，请重新确认你的资料！");
        }else{
            alert("提交订单失败");
        }
    })
})

/*设置价格格式及购买商品个数*/
function trolleyLength(){
    //购买商品个数
    var len = $(".trolleyTr").length;
    $("#number").empty().append(len);   // 设置购买商品个数
    //设置价格格式为小数点后两位
    var num = $(".prise").length;
    var a = 0.00;
    for(var i=0;i<num;i++){
        var num1 = $(".number-item").eq(i).html();
        var b = $(".prise").eq(i).html();  //获取当前循环的页面的值
        var c = b*num1;
        a =  parseFloat(a)+ parseFloat(c)  //转化为浮点型，jquery没有decimal双精度类型
        a = priceFormat(a);
    }
    $("#originalPrise").empty().append(a);
    $("#payPrice").empty().append(a);
}


/*付款及优惠金额金额*/
$("body").on("click","input[name='coupon_radio']",function(){
    /*复选框只能选一个 及 选择优惠券时设置优惠金额*/
    $("input[name='coupon_radio']").attr("checked",false);
    $(this).attr('checked','true');
    //选择优惠券时，增加优惠金额
    if($(this).attr("checked")){
        var privilegePrice = $(this).val();
        var originalPrise = $("#originalPrise").html();
        $("#invoicePrise").empty().append(privilegePrice);
        var invoicePrise = $(this).val();
        var payPrice = parseFloat(originalPrise)- parseFloat(invoicePrise)
        payPrice = priceFormat(payPrice)
        $("#payPrice").empty().append(payPrice);
    }
})


/*设置价钱格式统一为保存两位小数*/
function priceFormat(payPrice){
    c = String(payPrice).split(".",2)  // 保留小数点后两位
    if (c[1]==undefined){
        payPrice = payPrice + ".00";
    }else {
       if (c[1].length<2){
        payPrice = payPrice + "0";
        }
    }
    return payPrice
}


/*开具发票复选框*/
$(function(){
    $("#invoice_choice").attr("checked",false);
    $(".invoice").hide();
})
$("body").on("click","#invoice_choice",function(){
    if($("#invoice_choice").attr("checked")){
        $(".invoice").show();
    }else{
        $(".invoice").hide();
    }
})

/*修改地址*/
$("body").on("click",".manage",function(){
    $(".doubleClick").attr({
        "href":"#modal-container-666",  //追加属性
        "data-toggle":"modal",
    }).click();

})

/*打印手货地址列表*/
function submitAddressList(){
   $.post("/ShoppingCart/userAddressList",function(data){
        var jsonData=$.parseJSON(data);
        var str="";
        for (var i in jsonData){
            str+="<div class='userAddInfo'><ul><li>&nbsp;&nbsp;&nbsp;收货人：<span>"+jsonData[i].addPeople+"</span></li><li>收货地址：<span>"+jsonData[i].provinceName+"&nbsp;"+jsonData[i].areaName+"&nbsp;"+jsonData[i].addInfor+"</span></li><li>联系电话：<span>"+jsonData[i].addPhone+"</span></li>"
            if(jsonData[i].isDefault){
            str+="<li>默认收货地址&nbsp;|&nbsp;<input name='choseAddress' type='radio' id="+ jsonData[i].addId+" checked />选择&nbsp;|&nbsp;"
            }else{
                str+="<li><input name='choseAddress' type='radio' id="+ jsonData[i].addId+"  />选择&nbsp;|&nbsp;"
            }
            str+="<a href='#'class='manage' id='"+ jsonData[i].addId+"'>修改</a>&nbsp;|&nbsp;<a href=''class='delete' id='"+jsonData[i].addId +"'>删除</a></li></ul></div>"
        }
        $(".userAddress").empty().append(str);

       //设置收货地址div高度为其中最大高度
        var userAddInfoMaxHeight = 0; //定义最大高度变量
        var userAddInfoHeight = 0;   //定义当前循环div高度变量
        var $userAddInfo = $(".userAddInfo");
        for (var i=0;i<$userAddInfo.length;i++){
            userAddInfoHeight = $userAddInfo.eq(i).outerHeight()
            if (userAddInfoHeight>userAddInfoMaxHeight){  //如果当前高度比最大高度大
                userAddInfoMaxHeight = userAddInfoHeight;  //改变最大高度值
            }
        }
        $userAddInfo.css({   //改变高度
            "height":userAddInfoMaxHeight-15
        })
        //高度设置结束
   })
}

/*支付方式*/
function getPayStyle(){
    $.post("/ShoppingCart/getPayStyle",function(data){
        var jsonData = $.parseJSON(data);
        var str = "";
        for (var i in jsonData){
            str += "<option value="+jsonData[i].payId+">"+jsonData[i].payName+"</option>"
        }
        $("#select").append(str);
    })
}