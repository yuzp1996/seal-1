
$(function(){
    getAdminName();            //右上角管理员信息
    GetAnnouncementList();  //加载公告下拉列表
})
/*获取管理员帐号，显示与右上角*/
function getAdminName(){
    $.post("/Seal/getAdminName",function(data){
        var str=data;
        $("#adminName").append(str);
    })
}

function GetAnnouncementList(){
    //console.log("test");
    $.post("/Seal/GetAnnouncementList",function (data){
        var str="";
        var jsonData=$.parseJSON(data);
        //console.log(jsonData);
        //console.log(jsonData[0].Place);
        for(var i in jsonData ){
//                           str +="<tr><td>"+jsonData[i].name+"</td><td>"+jsonData[i].goods"</td><td>"+jsonData[i].goods+"</td><td ><a href='javascript:void(0)' onclick=Delete(<a  href='#modal-container-183169' data-toggle='modal'>修改<i class='icon-edit' title='修改'></i></a></td></tr>"
                        str+="<tr><td>"+jsonData[i].Place+"</td><td>"+jsonData[i].AnnouncementName+"</td><td>"+jsonData[i].ADMIN+"</td><td>"+jsonData[i].CreateTime+"</td><td><a  href='_announcement/?informationId="+jsonData[i].informationId+"'><i class='icon-edit' title='修改'></i>修改</a></td></tr>";
        }
        $(".lists").empty().append(str);
    })
}
