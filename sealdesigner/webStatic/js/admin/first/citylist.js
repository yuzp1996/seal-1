$(function(){
    $.cookie("page",1);       //默认当前页数为1
    getAdminName();            //右上角管理员信息
    cityList("");  //加载城市列表      函数调用
    provinceList();  //加载省份下拉列表
})

/* 分 页 */
$("body").on("click",".pageNum",function(){
    if ( $.cookie("page")!=$(this).html()){  //判断点击的不是当前页
            $.cookie("page",$(this).html());
    }
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    cityList();
})
/*上一页*/
$("body").on("click",".pageUp",function(){
    var num = $.cookie("page");
    $.cookie("page",num-1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    cityList();
})

/*下一页*/
$("body").on("click",".pageDown",function(){
    var num = parseInt($.cookie("page"));
    $.cookie("page",num+1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    cityList();
})




/*首页*/
$("body").on("click",".first",function(){
    $.cookie("page",1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    cityList();
})

 /*尾页*/
$("body").on("click",".Last",function(){
    $.cookie("page",Math.ceil($.cookie("pageCount")/10));
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    cityList();
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
    cityList();
})





/*搜索地区*/
$("body").on("click",".butt",function(){  // 搜索按钮的id
    cityList($(".input-xlarge").val());  //搜索地区
})



/*点击添加按钮*/
$("body").on("click",".addButton",function(){
    $.ajaxSetup({
          async : false     //ajax同步，某认为false异步
        });
    if ($(".province").val()==0){
        $(".newProvince").show().val("");
    }else {
        $(".newProvince").hide();
    }
    $(".selectCity").show();
    $(".province").val("1");
    $(".addProvince").val("");
    $(".addArea").val("");
    $(".btn-primary").val("添加");
})


/*点击修改*/
$("body").on("click",".manage",function(){
    $(".btn-primary").val("确认修改");  //将按钮改为修改
    var areaId = $(this).attr("id");
    $.post("/Seal/getArea",{"areaId":areaId},function(data){
        var jsonData = $.parseJSON(data);
        $(".newProvince").show();
        $(".addProvince").val(jsonData[0].provinceName);
        $(".province").val(jsonData[0].provinceId);
        $(".selectCity").hide();
        $(".addArea").val(jsonData[0].areaName);
        $(".areaId").val(jsonData[0].areaId)
        if(jsonData[0].isShow){
            $("input[name='isShowRadio']:first").attr('checked', 'true');
        }else{
            $("input[name='isShowRadio']:last").attr('checked', 'true');
        }
    })
})


/*添加地区*/
$("body").on("click",".btn-primary",function(){
    if ($(this).val()=="添加"){
        saveNewArea();

    }else if ($(this).val="确认修改"){
        changeArea();
    }
})

/*修改*/
function changeArea(){
     $.post("/Seal/changeArea",{"areaId":$(".areaId").val(),"provinceId":$(".province").val(),"addProvince":$(".addProvince").val(), "addArea":$(".addArea").val(),"radioVal":$("input[name='isShowRadio']:checked").val()},function(data){
        if (data==1){
            alert("保存成功");
            window.location.reload(true);    //页面重新加载
        }else if (data==2) {
            alert("当前地区已经存在")
        }else if (data==3){
            alert("当前省份已经存在")
        }else{
            alert("保存失败")
        }
     })

}
/*地区详情*/
/*点击地区*/
function saveNewArea(){
    var jsonStr = {};
    if($(".province").val()==0){
        if($(".addProvince").val()==""){
            alert("请填入省份");
            return ;
        }
        jsonStr=$.extend({},jsonStr,{"addProvince":$(".addProvince").val()});
    }
    else{
        jsonStr=$.extend({},jsonStr,{"provinceId":$(".province").val()});
    }
    if($(".addArea").val()==""){
        alert("请填入地区");
        return ;
    }
    jsonStr=$.extend({},jsonStr,{"addArea":$(".addArea").val()},{"radioVal":$("input[name='isShowRadio']:checked").val()});
    $.post("/Seal/addPlace",jsonStr,function(data){
        if (data==1){
            alert("保存成功");
            window.location.reload(true);
        }else if (data==2){
            alert("当前省份已经存在!")
        }else if (data==3){
            alert("当前地区已经存在!")
        }else {
            alert("保存失败")
        }
    })
}

/*点击添加新的省份*/
$("body").on("change", ".province", function(){
    if ($(this).val()==0){
        $(".newProvince").show();
    }
    else{
        $(".addProvince").val("");
        $(".newProvince").hide();
    }
})


/* 省份下拉列表*/
function provinceList(){
    var str = ""
    $.post("/Seal/provinceList",function(data){
        if (parseInt(data)==0){
            $(".newProvince").show();
        }
        var jsonData = $.parseJSON(data);

        for(var i in jsonData){
            str+="<option value='"+jsonData[i].provinceId+"'>"+jsonData[i].provinceName+"</option>";
        }
        str+="<option value='0'>添加新的省份</option>";
        $(".province").empty().append(str);
    })
}


/*打印地区列表*/
function cityList(orderStr){
    var jsonStr = "";
    if (orderStr!=""){
        jsonStr = $.extend({},jsonStr,{"orderStr":orderStr});
    }
    jsonStr = $.extend({},jsonStr,{"page":$.cookie("page")});
    $.post("/Seal/getCityList",jsonStr,function(data){
        var jsonData=$.parseJSON(data);
        var str="";
        for(var i in jsonData){
            str+="<tr><td>"+jsonData[i].provinceName+"</td><td>"+jsonData[i].areaName+"</td><td>"+jsonData[i].isShow+"</td><td><a class='manage' href='#modal-container-183169' data-toggle='modal' id='"+jsonData[i].areaId+"'>修改<i class='icon-edit' title='修改'></a></td></tr>";
        }
        $(".lists").empty().append(str);
        $.cookie("pageCount",jsonData[0].num);
        if (jsonData[0].num!=0){
            $(".page").empty().append(pageJs(jsonData[0].num,10));    //加载分页列表
        }
    })
}


/*获取管理员帐号，显示于右上角*/
function getAdminName(){
    $.post("/Seal/getAdminName",function(data){
        var str=data;
        $("#adminName").append(str);
    })
}