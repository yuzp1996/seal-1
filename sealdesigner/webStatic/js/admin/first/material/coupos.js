/*
    后台套餐管理
    王健
    2016/3/2
*/

//从数据库读取信息绑定到界面
function getAdminName(){
    $.post("/Seal/getAdminName",function(data){
        var str=data;
        $("#adminName").append(str);
    })
}
//获取套餐
function getCouppos(){
    $.ajaxSetup({
          async : false
    });
    $.post("/Seal/getCouppos",function(data){
        var jsonData = $.parseJSON(data);
        var str = "";
        var str1 = "";
        str="<table><thead><tr><tr width='100%'><th width='25%'>套餐名称</th><th width='25%'>优惠价格</th><th width='25%'>显示</th><th width='25%'>操作</th></tr></thead><tbody>";
        for(i in jsonData){
            str +="<tr><td>"+jsonData[i].name+"</td><td>"+jsonData[i].price+"</td><td>"+jsonData[i].is+"</td><td ><a href='javascript:void(0)' onclick=Delete('"+jsonData[i].id+"','Ch') >删除<i class='icon-remove' title='删除'></i></a>&nbsp;&nbsp;<a  href='#modal-container-183169' data-toggle='modal'>修改<i class='icon-edit' title='修改'></i></a></td></tr>"
            str1 += "<option value ='"+jsonData[i].id+"'>"+jsonData[i].name+"</option>";
        }
        str +=  "</tbody></table>";
        $("#Couppos").empty().append(str);
        $("#bindCoupos").empty().append(str1);
    });
}
//添加套餐
$("#gdbtnadd").click(function(){
    $.ajaxSetup({
          async : false
    });
    $.post("/Seal/coupposAdd",{"name":$("#couposName").val(),"price":$("#couposPrice").val(),"remarks":$("#couposRemark").val(),"show":$('input[name="show"]:checked').val() },function(data){
        if(data == 1)
            alert("添加成功！");
        else
            alert("添加失败");
    });
})

//获取商品
function getChapter(){
    $.ajaxSetup({
          async : false
    });
    $.post("/Seal/getGoods",function(data){
        var jsonData = $.parseJSON(data);
        var str = "";
        for(var i in jsonData){
            str += "<option value ='"+jsonData[i].id+"'>"+jsonData[i].name+"</option>";
        }
        $("#Maselect").empty().append(str);
        $("#goods").empty().append(str);
    });
}
//获取已绑定的套餐
function getbind(){
    $.ajaxSetup({
          async : false
    });
    $.post("/Seal/getbind",function(data){
        var jsonData = $.parseJSON(data);
        var str1 = "";
        str="<table><thead><tr><tr width='100%'><th width='25%'>套餐名称</th><th width='25%'>绑定商品</th><th width='25%'>显示</th><th width='25%'>操作</th></tr></thead><tbody>";
        for(i in jsonData){
            str +="<tr><td>"+jsonData[i].name+"</td><td>"+jsonData[i].goods"</td><td>"+jsonData[i].goods+"</td><td ><a href='javascript:void(0)' onclick=Delete('"+jsonData[i].id+"','Ch') >删除<i class='icon-remove' title='删除'></i></a>&nbsp;&nbsp;<a  href='#modal-container-183169' data-toggle='modal'>修改<i class='icon-edit' title='修改'></i></a></td></tr>"
        }
        str +=  "</tbody></table>";
        $("#addBundling").empty().append(str);
    });
}
//绑定套餐
$("#bindadd").click(function(){
    $.ajaxSetup({
          async : false
    });
    $.post("/Seal/bindadd",{"goods":$("#goods").find("option:selected").val(),"coupos":$("#bindCoupos").find("option:selected").val(),"show":$('input[name="show"]:checked').val() },function(data){
        if(data == 1)
            alert("添加成功！");
        else
            alert("添加失败");
    });
})

$(function(){
    getAdminName();
    getCouppos();
    getChapter();
    getbind();


})