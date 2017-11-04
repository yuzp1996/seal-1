//    后台类别管理
//    王健
//    2016/3/1
//从数据库读取信息绑定到界面

$(function(){
    getAdminName();
    getChapter();
    getMa();
    getCh();
})
function getAdminName(){
    $.post("/Seal/getAdminName",function(data){
        var str=data;
        $("#adminName").append(str);
    })
}
//获取商品
function getChapter(){
    $.ajaxSetup({
          async : false
    });
    $.post("/Seal/getGoods",function(data){
        var jsonData = $.parseJSON(data);
        var str = "";
        str="";
        for(var i in jsonData){
            str +="<tr><td>"+jsonData[i].name+"</td><td>"+jsonData[i].chapter+"</td><td>"+jsonData[i].material+"</td><td>"+jsonData[i].price+"</td><td>"+jsonData[i].remainder+"</td><td>"+jsonData[i].is+"</td><td>"+jsonData[i].font+"</td><td ><a href='javascript:void(0)' onclick=Delete('"+jsonData[i].id+"','Ch') >删除<i class='icon-remove' title='删除'></i></a>&nbsp;&nbsp;<a  href='#modal-container-183169' data-toggle='modal'>修改<i class='icon-edit' title='修改'></i></a></td></tr>"
        }
   /*     $("#commodity").empty().append(str);*/
    });
}
//添加商品
$("#gdbtnadd").click(function(){
    $.ajaxSetup({
          async : false
    });
    alert($("#Chadd").find("option:selected").val());
    $.post("/Seal/commodityAdd",{"name":$("#commodityname").val(),"material":$("#Maadd").find("option:selected").val(),"chapter":$("#Chadd").find("option:selected").val(),"price":$("#commodityprice").val(),"remainder":$("#commodityremainder").val(),"sale":$("#commoditysale").val(),"label":$("#commoditylabel").val(),"introduce":$("#commodityintroduce").val(),"show":$('input[name="show"]:checked').val(),"font":$('input[name="font"]:checked').val()},function(data){
        if(data ==1)
            alert("添加成功！");
        else
            alert("添加失败！！");
    })
    getMaterial();
})
//下拉列表
//材质
function getMa(){
    $.ajaxSetup({
          async : false
    });
    $.post("/Seal/getMaterial",function(data){
        var jsonData = $.parseJSON(data);
        var str = "";
        for(var i in jsonData){
            str += "<option value ='"+jsonData[i].id+"'>"+jsonData[i].name+"</option>";
        }

        $("#Chselect").empty().append(str);
        $("#Chadd").empty().append(str);
    });
}
//商品类别
function getCh(){
    $.ajaxSetup({
          async : false
    });
    $.post("/Seal/getCommodity",function(data){
        var jsonData = $.parseJSON(data);
        var str = "";

         for(var i in jsonData){
            str += "<option value ='"+jsonData[i].id+"'>"+jsonData[i].name+"</option>";
        }
        $("#Maselect").empty().append(str);
        $("#Maadd").empty().append(str);

    });
}
