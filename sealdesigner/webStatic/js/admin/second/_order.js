$(function(){
getAdminName();
getDetailmaterial();
getDetailPeople();
getDetailOrder();
getresponse();
})


function getAdminName(){
    $.post("/Seal/getAdminName",function(data){
        var str=data;
        $("#adminName").append(str);
    })
}


var orderId=window.location.search
orderId=orderId.split("=");
var value=decodeURIComponent(orderId[1]);
function getDetailmaterial(){
    $.post('/Seal/getDetailmaterial',{"orderId":value},function(data){
        var jsonData =$.parseJSON (data);
        var str="";
        var len=1;
        for (var i in jsonData ){
            var informationContent="";
            var informationContentlength="";
            for(var j in jsonData[i].content){
                len++;
                informationContent+="<tr><td>"+jsonData[i]["content"][j]+"</td></tr>"
            }
            str+="<div class='seal' style='clear:both'><h5>商品：</h5>"
            str+="<div class='orderDetail' style='float:left;width:90%;margin:0px 0px 0px 0px;padding:0px 0px 0px 0px'><table ><tbody><tr><th>商品</th><td class='sealName'>"+jsonData[i].materialName+"</td><th>数量</th><td class='numbers'>"+jsonData[i].num+"</td><td rowspan='4'width='200px' height='160px'><img  alt='商品照片' class='orderStyle' src='"+jsonData[i].picture+"'  style='' > </td></tr>"
            str+="<tr><th>商品类型</th><td class='sealType'>"+jsonData[i].sealClassName+"&nbsp;&nbsp;"+jsonData[i].materialQualityName+"</td><th>单价</th><td class='price'>￥"+jsonData[i].materialPrice+"</td></tr><tr><th>颜色</th><td class='color'>红色</td><th>字体</th><td class='font'>"+jsonData[i].font+"</td></tr>"
            str+="<tr><th rowspan='"+len+"'>所刻字</th>"+informationContent+"</tr></tbody></table></div><button id='download"+i+"' onclick='download(this)'  value='"+jsonData[i].userDataId+"' style='margin:182px 0px 0px -125px'>下载附件</button></div></div>"

            }
        $(".order").empty().append(str);
        for(var i in jsonData){
        if (jsonData[i].parentClass!=2){
            var a="download"+i;
            $("#"+a).hide();
           }}
    });
}
function getresponse(){
    $.post('/Seal/getresponse',{"orderId":value},function(data){
    var jsonData =$.parseJSON (data);
    var str="";
        str+=jsonData[0].responseMessage
    if (str="null"){str="";}
    $(".adminRemark").append(str);
    });
}

function getDetailPeople(){
    $.post('/Seal/getDetailPeople',{"orderId":value},function(data){
        var jsonData =$.parseJSON (data);
        var str="";
        for (var i in jsonData ){
        str += "<tr><td height='30px'>"+jsonData[i].addPeople+"</td><td>"+jsonData[i].addProvinceName+""+jsonData[i].addAreaName+"</td><td>"+jsonData[i].addInfor+ "</td><td>"+jsonData[i].addPhone+ "</td></tr>"
//        str+="<li>收货人:<span>"+jsonData[i].addPeople+"</span></li><br /><li>收货地址:<span>"+jsonData[i].addProvinceName+""+jsonData[i].addAreaName+""+jsonData[i].addInfor+"</span></li><br /><li>联系电话:<span>15131601294</span></li><br />"
        }
        $(".listpeople").empty().append(str);

    });
}

function getDetailOrder(){
    $.post('/Seal/getDetailOrder',{"orderId":value},function(data){
        var jsonData =$.parseJSON (data);
        var str="";
        var str1="";

        for (var i in jsonData ){
//        str+="<li>下单日期:<span>"+jsonData[i].createtime+"</span></li><br /><li>处理日期:<span>"+jsonData[i].changeDate+"</span></li><br /><li>使用优惠券:<span>"+jsonData[i].privilege+"</span></li><br /><li>总额:<span>"+jsonData[i].payPrice+"</span></li><br /><li>付款方式:<span>"+jsonData[i].pay+"</span></li><br />"
//        str+="<li>备注：<span>"+jsonData[i].singleMemo+"</span></li>"
             str += "<td height='30px'>"+jsonData[i].createtime+"</td><td style='color:red'>"+jsonData[i].changeDate+"</td><td>"+jsonData[i].privilege+"</td><td>"+jsonData[i].payPrice+"</td><td class='payWay'>"+jsonData[i].pay+"</td><td>"+jsonData[i].singleMemo+"</td><td>"+jsonData[i].isIvoice+"</td>"
        /*如果状态为已发货显示物流单号*/
        if (jsonData[i].isIvoice=="是"){
//            $(".isIvoice").show();
//            str1+="<li>发票抬头：<span>"+jsonData[i].invoiceHead+"<span></li><br /><li>发票明细：<span>"+jsonData[i].invoiceDetail+"</span></li><br />"
//            $(".receipt").empty().append(str1);
            $(".invoiceHead").show();
//            $(".invoiceDetail").show();
            str +="<td height='30px'>"+jsonData[i].invoiceHead+"</td><td></td>"
        }
        else{
            $(".invoiceHead").hide();
//            $(".invoiceDetail").hide();
        }
        $(".statusSelect").val(jsonData[i].orderState);
         /*打回修改*/
        if($("select option:selected").val()==-1){//这里应该加上管理员备注打回修改的原因
           $("#-1").hide();
           $("#3").hide();
           $("#2").show();
        }
         /*删除订单*/
        if($("select option:selected").val()==0){
             $("#6").hide();
           alert("该用户已经删除该订单");
        }
         /*待处理*/
        if($("select option:selected").val()==1){
             $("#2").show();
        }
         /*审核*/
        if($("select option:selected").val()==2){
             $("#-1").show();
             $("#3").show();
             $("#2").hide();
        }
         /*交付制作*/
        if($("select option:selected").val()==3){
             $("#4").show();
             $("#6").hide();
             $("#3").hide();
             $("#-1").hide();
//             $(".status").show();
             $(".response").hide();
        }
        /*发货状态*/
        if($("select option:selected").val()==4){
            $(".status").show();
//             $("#5").show(); // 不允许管理员进行收货处理  系统会自动判断
             $("#6").hide();
             $("#4").hide();
             $.post('/Seal/getDetailOrder',{"orderId":value},function(data){
                $(".logistics").empty().append(jsonData[0].logistics);
                $(".express").empty().append(jsonData[0].express);
              });
             $(".logistics").attr("disabled","disabled");
             $(".express").attr("disabled","disabled");
        }
         /*已收货*/
        if($("select option:selected").val()==5){
             $("#6").hide();
             $(".status").show();
             $("#5").hide();
             $.post('/Seal/getDetailOrder',{"orderId":value},function(data){
                $(".logistics").empty().append(jsonData[0].logistics);
                $(".express").empty().append(jsonData[0].express);
              });
             $(".logistics").attr("disabled","disabled");
             $(".express").attr("disabled","disabled");
        }
         /*管理员取消订单*/
        if($("select option:selected").val()==6){
           $("#6").hide();
           $("#2").hide();
           $("#-1").hide();
           $("#3").hide();
           if(jsonData [i].pay=="在线支付"){
            $("#10").show();
           }
        }
         /*用户取消订单*/
        if($("select option:selected").val()==7){
           $("#6").hide();
           $("#2").hide();
           $("#-1").hide();
           $("#3").hide();
        }
         /*等待退款*/
        if($("select option:selected").val()==9){
           $("#6").hide();
           $("#2").hide();
           $("#-1").hide();
           $("#3").hide();
           $("#10").show();
        }
         /*退款中*/
        if($("select option:selected").val()==10){
           $(".aa").show();
           $("#10").hide();
           $("#6").hide();
        }
         /*退款成功*/
         if($("select option:selected").val()==11){
           $("#6").hide();
           $(".aa").hide();

        }
        }
        $(".listDetailOrder").empty().append(str);
    });
}
/*下载方法*/
function download(obj){
    var userDataId = obj.value;
    $.post('/Seal/getLink',{"orderId":value,"userDataId":userDataId},function(data){
        var jsonData = $.parseJSON(data);
        var str="";
        for (var i in jsonData){
        str+="<a class='downloadlink' href='../webStatic/upload/"+jsonData[i].userId+"/"+jsonData[i].link+"' download='"+jsonData[i].link+"'></a>"

        }
        $("#link").empty().append(str);
        var x = $(".downloadlink");
        for (var i in x){
        x[i].click();
        }
    });
}




//发票和物流单号在加载界面时默认不显示
$(".isIvoice").hide();
$(".status").hide();
   


//返回按钮  返回上级页面
$("body").on("click","#back",function(){
   window.history.back(-1);
})

function changeState(state){
    $.post('/Seal/changeState',{"orderId":value,"state":state},function(data){

    });
}

$("body").on("click","#-1",function(){
var state=$(this).attr("id")
 if (confirm("确定打回修改并且填写管理员备注")){$.ajaxSetup({

              async : false
     });
     if($(".adminRemark").val()==""){
        alert("请在管理员备注注明打回修改的原因");
        return;
     }
     else{
            var responseMessage=$(".adminRemark").val()
            var logistics=$(".logistics").val()
            var express=$(".express").val()
            $.post('/Seal/savemessage',{"orderId":value,"logistics":logistics,"express":express,"responseMessage":responseMessage},function(data){
    if(data==1){alert("打回成功");}});
     }
    changeState(state);
    getDetailOrder();

    }
})
$("body").on("click","#2",function(){
    $.ajaxSetup({
              async : false
     });
    var state=$(this).attr("id")
    changeState(state);
    alert("若有附件请下载");
    getDetailOrder();

})
$("body").on("click","#3",function(){
var state=$(this).attr("id")
 $.ajaxSetup({
              async : false
     });
    changeState(state);
    getDetailOrder();
})
var responseMessage = $(".adminRemark").val()
var logistics=$(".logistics").val()
var express=$(".express").val()
$("body").on("click","#4",function(){
$(".status").show();
var state=$(this).attr("id")
 $.ajaxSetup({
              async : false
     });
     var responseMessage = $(".adminRemark").val()
    var logistics=$(".logistics").val()
    var express=$(".express").val()
    if($(".logistics").val()==""||$(".express").val()==""){
        alert("请输入物流单号和发货人");
        return;
    }
    $.post('/Seal/savemessage',{"orderId":value,"logistics":logistics,"express":express,"responseMessage":responseMessage},function(data){
    if (data==1){
    alert("发货成功");
    changeState(state);
    getDetailOrder();
    }
    else if(data==0){
    alert("物流单号已存在，发货失败");}
    });

})
//$("body").on("click","#5",function(){
//var state=$(this).attr("id")
// $.ajaxSetup({
//              async : false
//     });
//    changeState(state);
//    getDetailOrder();
//})
$("body").on("click","#6",function(){
var state=$(this).attr("id")
if (confirm("确定取消订单并且填写管理员备注")){
    $.ajaxSetup({
              async : false
     });
     if($(".adminRemark").val()!=""){
    changeState(state);
    getDetailOrder();}
    var responseMessage = $(".adminRemark").val()
    var logistics=$(".logistics").val()
    var express=$(".express").val()
    $.post('/Seal/savemessage',{"orderId":value,"logistics":logistics,"express":express,"responseMessage":responseMessage},function(data){});
    }
})

$("body").on("click","#10",function(){
    var state=$(this).attr("id")
     $.ajaxSetup({
              async : false
     });
    changeState(state);
    getDetailOrder();
})
$("body").on("click","#11",function(){
    var state=$(this).attr("id")
     $.ajaxSetup({
              async : false
     });
    changeState(state);
    getDetailOrder();
})
