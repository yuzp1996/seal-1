/*
客户详细信息查看和修改界面

*/
$(function(){
    _indexGetOrders();
})


/*获取用户订单信息*/
function _indexGetOrders(){
    $.post("/Seal/_indexGetOrders",{"userId":$(".userId").val()},function(data){
        var jsonData = $.parseJSON(data);
        var str= "";
        if (jsonData==""){
            str+="<tr><td colspan='6' style='font-size:16px;color:red;'>暂无订单</td></tr>"
        }
        for(var i in jsonData){
            var className = "";
            /*字符串拼接*/
            for (var j in jsonData[i].className){
                className += jsonData[i]["className"][j] + "<br/>"  // 拼接商品名称
            }
            str+="<tr><td>"+jsonData[i].orderDate+"</td><td>"+className+"</td>"
            if(jsonData[i].orderState=="打回修改"|jsonData[i].orderState=="取消订单"){
                str+="<td style='color:red;'>"+jsonData[i].orderState+"</td>"
            }else{
                str+="<td>"+jsonData[i].orderState+"</td>"
            }
            str+="<td>"+jsonData[i].payPrice+"</td><td>"+jsonData[i].isPaid+"</td><td><a href=_order?orderId="+jsonData[i].orderId+">查看</a></td></tr>"
        }
        $(".userOrderInfoLists").empty().append(str);
    })
}





/*二级界面管理客户基本信息*/
$(function(){
    $.post('/Seal/lookUser',{"userId":$(".userId").val()},function(data){
        var jsonData=$.parseJSON(data);
        var str = "";
        /*客户基本信息*/
        $(".userName").empty().append(jsonData[0].name);
        $(".userCity").empty().append(jsonData[0].city);
        $(".userRegisterTime").empty().append(jsonData[0].registerTime);
        $(".userLoginTime").empty().append(jsonData[0].lastTime);
        $(".userEmail").empty().append(jsonData[0].userEmail);
        $(".userPhone").empty().append(jsonData[0].userPhone);
        if (jsonData[0].isShow){
            $(".userStyle").val(1);
        }else {
            $(".userStyle").val(0);
        }
        if (jsonData[0].userPic!=null){
            $(".userPic").attr("src",jsonData[0].userPic)
        }
        $(".userRemark").val(jsonData[0].remark);
        /*客户收货信息*/
        for (i in jsonData){
            if (jsonData[i].userAddPeople==null){
                continue;
            }
            str+="<div class='userAddInfo'><ul><li>&nbsp;&nbsp;&nbsp;收货人：<span>"+jsonData[i].userAddPeople+"</span></li><li>收获地址：<span>"+jsonData[i].userAddInfor+"</span></li><li>联系电话：<span>"+jsonData[i].userAddPhone+"</span></li>"
            if (jsonData[i].userAddDefault=='True'){
                str+="<li><input type='radio' name='default' checked> 默认收货地址</li></ul></div>"
            }else{
                str+="<li></li></ul></div>"
            }
        }
        $(".userAddInfoList").empty().append(str);
        /*不同方式打开的效果不同*/
        if ($(".userInfoOpen").val()=='look'){
            $(".userRemark").attr("readonly","readonly");
            $(".userStyle").attr("disabled","disabled")
            $("#userInfoSubmit").hide();
        }
    })
})

$("body").on("click","#userInfoSubmit",function(){
    if ($(".userStyle").val()==0){
        if(!confirm("当前客户状态为禁用状态，则该客户不能再使用本账号登录本系统！")){
            return;
        }
    }
    $.post("/Seal/userInfoSave",{"userId":$(".userId").val(),"isShow":$(".userStyle").val(),"remark":$(".userRemark").val()},function(data){
        if (data==1){
            alert("修改成功");
            window.location.href="adminindex";
        }else {
            alert("修改失败")
        }
    })
})

$("body").on("click","#backUaerInfoList",function(){
    window.history.back(-1);
})
