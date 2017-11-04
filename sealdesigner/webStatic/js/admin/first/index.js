/*

后台管理首页js
王志文
2016/1/11

*/

$(function(){
    $(".orderBy").val("0");  //设置默认排序的方式
    $.cookie("page",1);       //默认当前页数为1
    getAdminName();            //右上角管理员信息
    $.ajaxSetup({
          async : true
        });
    orderByCondition($(".orderBy").val());  //将信息初始化排序
    addSelect();    //添加省份下拉选项
    setTimeout(NewsComing,1000)

    })
/* 分 页 */
$("body").on("click",".pageNum",function(){
    if ( $.cookie("page")!=$(this).html()){  //判断点击的不是当前页
            $.cookie("page",$(this).html());
    }
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    orderByCondition($(".orderBy").val());
})
/*上一页*/
$("body").on("click",".pageUp",function(){
    var num = $.cookie("page");
    $.cookie("page",num-1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    orderByCondition($(".orderBy").val());
})

/*下一页*/
$("body").on("click",".pageDown",function(){
    var num = parseInt($.cookie("page"));
    $.cookie("page",num+1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    orderByCondition($(".orderBy").val());
})




/*首页*/
$("body").on("click",".first",function(){
    $.cookie("page",1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    orderBy(jsonStrMake(orderByCondition));
})

 /*尾页*/
$("body").on("click",".Last",function(){
    $.cookie("page",Math.ceil($.cookie("pageCount")/10));
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    orderBy(jsonStrMake(orderByCondition));
})

//跳转页
$("body").on("click",".gotoPage",function(){
    gotoPage = $(".gotoPageNum").val()
    if (gotoPage>Math.ceil($.cookie("pageCount")/10))
    {
       alert("输入页码大于最大页码");
       return
    }
    $.cookie("page",$(".gotoPageNum").val());
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    orderBy(jsonStrMake(orderByCondition));

})


/* 所属地区：（省份）下拉列表值改变时，相应加载地区下拉列表 */
$("body").on("change", "#province", function(){
    var str="<option value='0'>请选择</option>";
    if ($("#province").val()==0){   //没有选择省份则将界面按照排序条件排序
        $("#area").empty().append(str);   //将地区下拉列表置空
        orderByCondition($(".orderBy").val());
        $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    }else{
        $.post("/Seal/selectArea",{ "provinceId":$("#province").val()},function(data){
            var jsonData=$.parseJSON(data);
            for(var i in jsonData){
                str+="<option value="+jsonData[i].areaId+">"+jsonData[i].areaName+"</option>";
            }
            $("#area").empty().append(str);
        })
    }
})

/* 当所属地区地区选定时，更新用户列表 */
$("body").on("change", "#area", function(){
    if ($("#area").val()!=0)
    {
        $.cookie("page",1);

        $.ajaxSetup({   //  ajax同步   //地区选定的时候，同步将分页列表更新
          async : false
        });
        orderByCondition($(".orderBy").val());
        $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    }
})


/* 按照姓名搜索*/
$("body").on("click",".butt",function(){
    if ($(".input-xlarge").val()!=""){
        $.ajaxSetup({
          async : false
        });
       orderByCondition($(".orderBy").val())
       $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    }
})


/* 选择不同的排序方式 */
$("body").on("change",".orderBy",function(){
    $.cookie("page",1);  //更改当前排序方式时，页数自动设置为1
    orderByCondition($(this).val())
})


/*点击查看*/
$("body").on("click",".look",function(){
    $(".btn-primary").hide();
    showUser($(this).attr("id"));
})


/* 点击管理 */
$("body").on("click",".manage",function(){
    $(".btn-primary").show();
    showUser($(this).attr("id"));
    var isShowHtml = $(".isShow").html();
    var remarkHtml= $(".remark").html();
    $(".isShow").empty().append("<input type='text' class='isShowText' value='"+isShowHtml+"'style='width:30%;margin-top:3px;'/><span><a>请修改为“是”或“否”</a></span>");
    $(".remark").empty().append("<input type='text' class='remarkText' value='"+remarkHtml+"'style='width:90%;margin-top:3px;'/>");
})


/*点击保存修改*/
$("body").on("click",".btn-primary",function(){
    var isShowHtml = $(".isShowText").val();
    var remarkText = $(".remarkText").val();
    var jsonStr= {};
    if (isShowHtml=="是"){
        isShow = 0;
    }else if(isShowHtml=="否"){
        isShow = 1;
    }else{
        alert("是否禁用输入有误，请重新输入，务必输入字符为“是”或“否”！");
        return;
    }
    jsonStr=$.extend({},{"userId":$(".userId").html()},{"adminId":$.cookie("SealadminID")},{"isShow":isShow},{"areaId":$("#area").val()});
    $.post("/Seal/saveAs",jsonStr,function(data){
        if (parseInt(data)){
            alert("修改成功！");
            orderByCondition($(".orderBy").val());
        }else{
            alert("修改失败！")
        }
        window.location.reload(true);
    })
})


/*根据不同的条件排序*/
function orderByCondition(orderByValue){
    if (orderByValue==1){
        orderBy(jsonStrMake("loginTime"));
    }else if (orderByValue==2) {
        orderBy(jsonStrMake("-registerTime"));
    }else if (orderByValue==3) {
        orderBy(jsonStrMake("registerTime"));
    }else if (orderByValue==4) {
        orderBy(jsonStrMake("areaId"));
    }else if (orderByValue==5) {
        orderBy(jsonStrMake("-areaId"));
    }else if (orderByValue==6) {
        orderBy(jsonStrMake("-userName"));
    }else if (orderByValue==7){
        orderBy(jsonStrMake("userName"));
    }else {
        orderBy(jsonStrMake("-loginTime"));
    }

}


/*获取管理员帐号，显示与右上角*/
function getAdminName(){
    $.post("/Seal/getAdminName",function(data){
        var str=data;
        $("#adminName").append(str);
    })
}


/* 拼接查询的字符串，地区优先，*/
function jsonStrMake(orderByCondition){
    jsonstr={};
    if ($(".input-xlarge").val()!=""){   //搜索用户名
        jsonstr=$.extend({},jsonstr,{"userName":$(".input-xlarge").val()});
    }
    if ($("#area").val()!=0){
        jsonstr=$.extend({},jsonstr,{"areaId":$("#area").val()});
    }
    jsonstr=$.extend({},jsonstr,{"orderByCondition":orderByCondition},{"page":$.cookie("page")}); //初始化json字符串
    return jsonstr;
}


/*更新用户列表*/
function orderBy(jsonstr){
    $.post("/Seal/orderBy",jsonstr,function(data){
        $(".lists").empty();
        var jsonData=$.parseJSON(data);
        var str="";
        for(var i in jsonData){
            str+="<tr><td>"+jsonData[i].name+"</td><td>"+jsonData[i].city+"</td><td>"+jsonData[i].registerTime+"</td><td>"+jsonData[i].lastTime+"</td><td>"+jsonData[i].isShow+"</td><td><a class='look' href='adminindex?name=look&userId="+jsonData[i].userId+"'><i class='icon-eye-open' title='查看'/>查看</a>&nbsp;<a class='look' href='adminindex?name=manager&userId="+jsonData[i].userId+"'><i class='icon-edit' title='管理'/>管理</a></td></tr>";

        }
        $.cookie("pageCount",jsonData[0].pageNum);
        if (jsonData[0].pageNum!=0){
            $(".page").empty().append(pageJs($.cookie("pageCount"),10));    //加载分页列表
        }
        $(".lists").append(str);
    });
}


/* 加载选择框(省份)中值*/
function addSelect(){
    $.post("/Seal/selectProvince", function(data){
        var jsonData=$.parseJSON(data);
        var str = "";
        for ( var i in jsonData){
            str+="<option value="+jsonData[i].provinceId+">"+jsonData[i].provinceName +"</option>";
        }
        $("#province").append(str);
    })
}


/*弹窗显示*/
function showUser(userId){
    var str = "";
    $.post("/Seal/lookUser",{ "userId":userId},function(data){
        var jsonData=$.parseJSON(data);
        if (jsonData.length>0){
            for(var i in jsonData){
            str+="<tr><td>用户名:</td><td>"+jsonData[i].name+"</td></tr><tr><td>编号:</td><td class='userId'>"+jsonData[i].userId+"</td></tr><tr><td>密码:</td><td>"+jsonData[i].userPwd+"</td></tr><tr><td>地区:</td><td>"+jsonData[i].city+"</td></tr><tr><td>照片:</td><td>"+jsonData[i].userPic+"</td></tr>";
            str+="<tr><td>注册时间:</td><td>"+jsonData[i].registerTime+"</td></tr><tr><td>最近登录:</td><td>"+jsonData[i].lastTime+"</td></tr><tr><td>是否禁用:</td><td class='isShow'>"+jsonData[i].isShow+"</td></tr><tr><td>备注:</td><td class='remark'>"+jsonData[i].remark+"</td></tr>";
            }
            $(".lookUsers").empty().append(str);
        }
    })
}