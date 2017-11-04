
$(function(){
    getUserInfor();
    getOrders();
//    $.ajaxSetup({
//        async : false     //ajax同步，默认为false异步
//    });
})


/*获取用户订单信息*/
function getOrders(){
    $.post("/Users/getOrders",function(data){
        var jsonData = $.parseJSON(data);
        var str= "";
        if (jsonData==""){
            str+="<tr><td colspan='5' style='font-size:16px;color:red;'>暂无订单</td></tr>"
        }
        for(var i in jsonData){
            var materialName = "";
            /*字符串拼接*/
            for (var j in jsonData[i].materialName){
                materialName += jsonData[i]["materialName"][j] + "<br/>"  // 拼接商品名称
            }
            if(jsonData[i].orderState=="返回修改"|jsonData[i].orderState=="取消订单"){
                str+="<tr  style='color:red;'><td>"+materialName+"</td><td>"+jsonData[i].payPrice+"</td><td>"+jsonData[i].orderState+"</td>"
            }else{
                str+="<tr><td>"+materialName+"</td><td>"+jsonData[i].payPrice+"</td><td>"+jsonData[i].orderState+"</td>"
            }
            str+="<td>"+jsonData[i].orderDate+"</td><td><a id="+jsonData[i].orderId+" href='/Users/myOrder?orderId="+jsonData[i].orderId+"'>查看</a></td></tr>"
        }
        $(".myOrderHead").append(str);
    })
}




/*获取用户信息*/
function getUserInfor(){
    $.post("/Users/getUserInfor",{"userId":$.cookie("userId")},function(data){
        var jsonData = $.parseJSON(data);
        var str= "";
        for(var i in jsonData){
            if (jsonData[i].userPic!=null){
                $(".imgArea").attr("src",jsonData[i].userPic);    //获取用户图片
            }else{
                $(".imgArea").attr("src","/webStatic/img/user/88888.png");  //默认图片
            }
            $(".userName").html(jsonData[i].userName);
            if (jsonData[i].userPhone==null){
                $(".userPhone").html("暂无联系方式");
            }else{
                $(".userPhone").html(jsonData[i].userPhone);
            }
            if (jsonData[i].area==""){
                $(".area").html("暂无地区信息");
            }else{
                $(".area").html(jsonData[i].area);
            }
        }
    });
}