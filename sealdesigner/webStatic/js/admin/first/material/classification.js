$(function(){

    getAdminName();//获取右上角管理员信息
    $.cookie("page",1);//默认当前页数为1
    getSeal_ParentMeterialClass();//获取商品类别下拉列表
    sealClassChooseList();
});

//从数据库读取信息绑定到界面

/* 分 页 */
$("body").on("click",".pageNum",function(){
    if ( $.cookie("page")!=$(this).html()){  //判断点击的不是当前页
            $.cookie("page",$(this).html());
    }
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    sealClassChooseList("")
})
/*上一页*/
$("body").on("click",".pageUp",function(){
    var num = $.cookie("page");
    $.cookie("page",num-1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    sealClassChooseList("");
})

/*下一页*/
$("body").on("click",".pageDown",function(){
    var num = parseInt($.cookie("page"));
    $.cookie("page",num+1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    sealClassChooseList("");
})


function getAdminName(){
    $.post("/Seal/getAdminName",function(data){
        var str=data;
        $("#adminName").append(str);
    })
}

/*商品类别主界面*/
/*下拉列表----把getSeal_ParentMeterialClass方法读取出来的数据动态显示到前台*/
function getSeal_ParentMeterialClass(){
    $.post("/Seal/getSeal_ParentMeterialClass",function(data){

        var jsonData = $.parseJSON(data);
        var str = "<option value='0'>所有</option>";
        for (var i in jsonData){
            str += "<option value="+jsonData[i].parentClassId+">"+jsonData[i].parentName+"</option>"
        }
        $(".sealClassChoose").append(str);
    });
}


/*按商品父类查询*/
$("body").on("change",".sealClassChoose",function(){
    if ($(this).val()==0){
        sealClassChooseList("");
    }else {
        var sealParentClassId = $(this).val();
        sealClassChooseList(sealParentClassId);  //调用函数，并传一个参数
    }
});

function sealClassChooseList(sealParentClassId){
    var jsonStr = {};
    if (sealParentClassId!=""){
        jsonStr = $.extend({},jsonStr,{"sealParentClassId":sealParentClassId});  //字符串拼接
    }
    jsonStr = $.extend({},jsonStr,{"page":$.cookie("page")});
    $.post("/Seal/getSealClass",jsonStr,function(data){  //把声明id post给后台查找这个id下的所有附件信息
    var jsonData=$.parseJSON(data);
    var str="";
    for (var i in jsonData){
        var sealClassName = "";
        var sealClassId = "";
        var isShow = "";
        sealClassName = jsonData[i].sealclassname   //数组承载定量时不加引号,这里相当于二位数组
        sealClassId = jsonData[i].sealclassid
        isShow = jsonData[i].isShow
        sealParentClasstName=jsonData[i].sealclassparent
        //保存的时候，已经把每条声明的id赋给修改
        str += "<tr><td>"+sealClassName+"</td><td>"+sealParentClasstName+"</td><td>"+isShow+"</td>";
        str += "<td><a href='_classdetail?sealClassId="+sealClassId+"'data-toggle='modal' class='statementLook' ><i class='icon-eye-open'></i>查看</a>&nbsp&nbsp&nbsp&nbsp<a class='delete' data-toggle='modal' id='"+sealClassId+"'><i class='icon-remove'></i>删除</a></td>"
    }
    $(".classlist").empty().append(str);
    $.cookie("pageCount",jsonData[0].num);
        if (jsonData[0].num!=0){
            $(".page").empty().append(pageJs(jsonData[0].num,10));    //加载分页列表
}


});
}

/*点击查看*/
$("body").on("click",".statementLook",function(){
    showSealClass($(this).attr("id"));
    $(".sealClassId").val()=$(this).attr("id");
})



/*点击删除*/
$("body").on("click",".delete",function(){
    if (confirm("删除商品类别会删除该商品类别所有相关信息，\r\n是否确认删除商品类别?")){
    deleteSealClass($(this).attr("id"));
    }
});
    function deleteSealClass(sealClassId){
        $.ajaxSetup({async : false});
        $.post("/Seal/deleteSealClass",{ "sealClassId":sealClassId},function(data){
        if (data==1)
        {alert("删除成功");}
      else if(data==0)
        {alert("该商品类别已绑定商品，不允许删除");}
      });
    sealClassChooseList();
    }