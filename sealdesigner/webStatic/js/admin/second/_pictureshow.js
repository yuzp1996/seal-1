$(function(){
    getAdminName();            //右上角管理员信息
    getPicLocation();
})


/*获取管理员帐号，显示与右上角*/
function getAdminName(){
    $.post("/Seal/getAdminName",function(data){
        var str=data;
        $("#adminName").append(str);
    })
}

/*获取图片位置*/
function getPicLocation(){
    var piclocation=document.getElementById("piclocation");
    var p=document.getElementById("picList").rows[1].cells[0].innerHTML;
}