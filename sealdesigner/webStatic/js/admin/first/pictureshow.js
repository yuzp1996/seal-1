/*获取展示图片列表*/

$(function(){
    $.cookie("page",1);       //默认当前页数为1
    getAdminName();            //右上角管理员信息
    getPictures();         //加载图片列表
})

//获取展示图片列表

function getPictures(jsonStr){
    $.post("/Seal/picinfo",jsonStr,function(data){
        var str = "";
        var jsonData=$.parseJSON(data);
        for (var i in jsonData){
            str += "<tr><td>"+jsonData[i].picPlace+"</td><td>"+jsonData[i].picName+"</td><td>"+jsonData[i].createTime+"</td><td><a class='manage' onclick='look()' data-toggle='modal' id='"+jsonData[i].picId+"'>详情<i class='' title='详情'></a><a class='manage' onclick='look()' data-toggle='modal' id='"+jsonData[i].picId+"'>修改<i class='' title='修改'></a></td></tr>"
        }
        $("#picturelist").empty().append(str);
    })
}
//跳转详细页面函数
function look(){
    window.location.href="_pictureshow.html";
}

/*获取管理员帐号，显示与右上角*/
function getAdminName(){
    $.post("/Seal/getAdminName",function(data){
        var str=data;
        $("#adminName").append(str);
    })
}

