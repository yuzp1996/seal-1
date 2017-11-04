$(function(){
getList();
getAdminName();
$(".selectOrder").val(12);
$("#some_class_1").val("");
$("#some_class_2").val("");
$("#searchOrder").val("");

})

/*管理员信息*/
function getAdminName(){
    $.post("/Seal/getAdminName",function(data){
        var str=data;
        $("#adminName").append(str);
    })
}

/* 分 页 */
$("body").on("click",".pageNum",function(){
    if ( $.cookie("page")!=$(this).html()){  //判断点击的不是当前页
            $.cookie("page",$(this).html());
    }
    $(".page").empty().append(pageJs($.cookie("pageCount"),15));
    var orderState = $(".selectOrder").val();
    selectOrder();
})
/*上一页*/
$("body").on("click",".pageUp",function(){
    var num = $.cookie("page");
    $.cookie("page",num-1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),15));
    var orderState = $(".selectOrder").val();
    selectOrder();
})

/*下一页*/
$("body").on("click",".pageDown",function(){
    var num = parseInt($.cookie("page"));
    $.cookie("page",num+1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),15));
    var orderState = $(".selectOrder").val();
    selectOrder();
})

/*首页*/
$("body").on("click",".first",function(){
    $.cookie("page",1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),15));
    var orderState = $(".selectOrder").val();
    selectOrder();
})

 /*尾页*/
$("body").on("click",".Last",function(){
    $.cookie("page",Math.ceil($.cookie("pageCount")/10));
    $(".page").empty().append(pageJs($.cookie("pageCount"),15));
    var orderState = $(".selectOrder").val();
    selectOrder();
})

//跳转页
$("body").on("click",".gotoPage",function(){
    gotoPage = $(".gotoPageNum").val()
    if (gotoPage>Math.ceil($.cookie("pageCount")/15))
    {
       alert("输入页码大于最大页码");
       return
    }
    $.cookie("page",$(".gotoPageNum").val());
    $(".page").empty().append(pageJs($.cookie("pageCount"),15));
    var orderState = $(".selectOrder").val();
    selectOrder();

})




/*按处理状态查询*/
//$("body").on("change",".selectOrder",function(){
//    $("#some_class_1").val("");
//    $("#some_class_2").val("");
//    $("#searchOrder").val("");
//    if ($(this).val()==12){
//        getLists("");
//    }else {
//        var orderState = $(this).val();
//        getLists(orderState);  //调用函数，并传一个参数
//    }
//});
//
//function getLists(orderState){
//    var jsonStr={};
//    if (orderState!=""){
//        jsonStr = $.extend({},jsonStr,{"orderState":orderState,"beginDate":$("#some_class_1").val(),"lastDate":$("#some_class_2").val(),"searchOrder":$("#searchOrder").val()});
//    }
//    jsonStr = $.extend({},jsonStr,{"page":$.cookie("page")});
//    $.post("/Seal/getLists",jsonStr,function(data){
//    var str="";
//    var jsonData=$.parseJSON(data);
//    for (var i in jsonData){
//    str += "<tr><td>"+jsonData[i].orderId+"</td><td>"+jsonData[i].orderPrice+"</td><td>"+jsonData[i].orderState+ "</td><td>"+jsonData[i].isIvoice+"</td><td>"+jsonData[i].orderDate+"</td>"
//    str +="<td><a class='lookOrder' href='_order?orderId="+jsonData[i].orderId+"' id="+jsonData[i].orderId+"><i class='icon-edit' title='处理订单'></i>处理订单</a></td></tr>"
//        }
//    $(".lists").empty().append(str);
//    if(jsonData[0]!=undefined){
//    $.cookie("pageCount",jsonData[0].pageNum);
//        if (jsonData[0].pageNum!=0){
//            $(".page").empty().append(pageJs(jsonData[0].pageNum,10));    //加载分页列表
//            }
//        }
//    else{$.cookie("pageCount",0);}
//
//    });
//}
//
////按照订单编号查询订单
//$("body").on("click","#searchOeder1",function (){
//    var a=new Date($("#some_class_1").val().split("-"));
//    var b=new Date($("#some_class_2").val().split("-"));
//    if (a>b){alert("结束时间必须大于开始时间");}
//    else{
//        var orderState = $(".selectOrder").val();
//        getLists(orderState);
//    }
//})
function searchOrder(){
	var searchOrder = $("#searchOrder").val();
	var jsonStr = {};
	jsonStr = $.extend({},jsonStr,{"searchOrder":searchOrder,"page":$.cookie("page")});
	getList(jsonStr);
}
function selectOrder(){
	var beginDate = $("#some_class_1").val();
	var lastDate = $("#some_class_2").val();
	var orderState = $(".selectOrder").val();
	var jsonStr = {};
	jsonStr = $.extend({},jsonStr,{"orderState":orderState,"beginDate":beginDate,"lastDate":lastDate});
	getList(jsonStr);
}

function getList(jsonStr){
    var orderState = $(".selectOrder").val();
	jsonStr = $.extend({},jsonStr,{"orderState":orderState,"page":$.cookie("page")});
	$.post("/Seal/getLists",jsonStr,function(data){
	if (data==0){
	alert("没有查询到您所输入的订单号");
    window.location.reload();
	}
	else{
    var str="";
    var jsonData=$.parseJSON(data);
    for (var i in jsonData){
    str += "<tr><td>"+jsonData[i].orderId+"</td><td>"+jsonData[i].orderPrice+"</td><td>"+jsonData[i].orderState+ "</td><td>"+jsonData[i].isIvoice+"</td><td>"+jsonData[i].orderDate+"</td>"
    str +="<td><a class='lookOrder' href='_order?orderId="+jsonData[i].orderId+"' id="+jsonData[i].orderId+"><i class='icon-edit' title='处理订单'></i>处理订单</a></td></tr>"
        }
    $(".lists").empty().append(str);
    if(jsonData[0]!=undefined||str!=""){
    $.cookie("pageCount",jsonData[0].pageNum);
        if (jsonData[0].pageNum!=0){
            $(".page").empty().append(pageJs(jsonData[0].pageNum,15));    //加载分页列表
            }
        }
    else{$.cookie("pageCount",0);
         $(".page").empty().append(pageJs(1,15));

    }
    }
    });
}
$("body").on("change",".selectOrder",function(){
	$.cookie("page",1);
	selectOrder();
	$("#searchOrder").val("");
})
$("body").on("click","#searchOeder1",function(){
	var a=new Date($("#some_class_1").val().split("-"));
    var b=new Date($("#some_class_2").val().split("-"));
    if (a>b){alert("结束时间必须大于开始时间");}
	else{selectOrder();}
})
$("body").on("click","#searchOrder2",function(){
	searchOrder();
})