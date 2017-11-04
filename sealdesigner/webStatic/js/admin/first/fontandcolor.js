/*字体和颜色管理*/
$(function(){
    getcolor();
    getAdminName();
    getfont();
    $(".colorname").val("");
    $(".fontname").val("");
})
function getcolor(){
//获取颜色
    $.post("/Seal/getcolors",function(data){
        var jsonData=$.parseJSON(data);
        var str="";
        for(var i in jsonData){
            str+="<tr><td>"+jsonData[i].colorname+"</td><td>"+jsonData[i].isShow+"<td><a id='"+jsonData[i].colorid+"' href='#modal-container-2' class='enp-change' data-toggle='modal' style='margin-left:12px;'><i class='icon-edit'></i>修改</a></td></tr>"
        }
    $(".lists1").empty().append(str);
    });
}
$("body").on("click","#btnB,#btnA",function(){
    $(".btn-primary").val("添加");
    $(".colorname").val("");
    $(".fontname").val("");
    });

function addcolor(){
     $.ajaxSetup({
          async : false
    });

    $(".btn-primary").val("添加");
     if($(".colorname").val()==""){
        alert("请输入颜色");
        return ;
    }
    $.post("/Seal/addcolor",{"colorname":$(".colorname").val(),"radioVal":$("input[name='isShowRadio1']:checked").val()},function(data){
    if (data==1)
    {alert("添加成功");}
    else if(data==0)
    {alert("添加失败");}
    else if(data==2)
    {alert("该颜色已存在");}
    });

    getcolor();
    $(".colorname").val("");
    $(".close").click();

}




$("body").on("click",".enp-change",function(){
    //点击修改颜色
    $(".btn-primary").val("确认修改");
//    $("#modal-container-2").show();
    var colorId = $(this).attr("id");
    $.post("/Seal/changecolor",{"colorId":colorId},function(data){
        var jsonData=$.parseJSON(data);
        $(".colorname").val(jsonData[0].colorname);
        $(".colorname").attr("id",colorId)
        if(jsonData[0].isShow){
                $("input[name='isShowRadio1']:first").attr('checked', 'true');
            }else{
                $("input[name='isShowRadio1']:last").attr('checked', 'true');
            }
        });
});

function changecolor(){
     $.ajaxSetup({
          async : false
    });
    var colorId = $(".colorname").attr("id");
    $.post("/Seal/savechangecolor",{"colorId":colorId,"colorname":$(".colorname").val(),"radioVal":$("input[name='isShowRadio1']:checked").val()},function(data){
    if (data==1)
    {alert("修改成功");}
    else if(data==0)
    {alert("修改失败");}
    else if(data==2)
    {alert("该颜色已存在");}
    });
    getcolor();
    $(".close").click();
}

$("body").on("click","#btnAdd2",function(){
    if ($(this).val()=="添加"){
        addcolor();
    }else if ($(this).val()=="确认修改") {
        changecolor();
    }
})

//$("body").on("click",".deletecolor",function(){
//    $.ajaxSetup({
//        async:false
//    });
//    var colorId = $(this).attr("id");
//    if (confirm("确认删除?")){
//        $.post("/Seal/deletecolor",{"colorId":colorId},function(data){
//            if (data==1)
//            alert("删除成功！");
//            else
//            alert("删除失败！");
//       })};
//    getcolor();
//});
function getfont(){
//获取字体
    $.post("/Seal/getfonts",function(data){
        var jsonData=$.parseJSON(data);
        var str="";
        for(var i in jsonData){
            str+="<tr><td>"+jsonData[i].fontname+"</td><td>"+jsonData[i].isShow+"<td><a id='"+jsonData[i].fontid+"' href='#modal-container-1' class='enp-change' data-toggle='modal' style='margin-left:12px;'><i class='icon-edit'></i>修改</a></td></tr>"
        }
    $(".lists0").empty().append(str);
    });
}

function addfont(){
     $.ajaxSetup({
          async : false
    });
     if($(".fontname").val()==""){
        alert("请输入字体");
        return ;
    }
    $.post("/Seal/addfont",{"fontname":$(".fontname").val(),"radioVal":$("input[name='isShowRadio']:checked").val()},function(data){
    if (data==1){
        alert("添加成功");
        window.location.href="fontAndColor";
    }
    else if(data==0)
    {alert("添加失败");}
    else if(data==2)
    {alert("该字体已存在");}
    });
    $(".fontname").val("");
    getfont();
}

$("body").on("click",".enp-change",function(){
    //点击修改字体
    $(".btn-primary").val("确认修改");
//    $("#modal-container-2").show();
    var fontId = $(this).attr("id");
    $.post("/Seal/changefont",{"fontId":fontId},function(data){
        var jsonData=$.parseJSON(data);
        $(".fontname").val(jsonData[0].fontname);
        $(".fontname").attr("id",fontId)
        if(jsonData[0].isShow){
                $("input[name='isShowRadio']:first").attr('checked', 'true');
            }else{
                $("input[name='isShowRadio']:last").attr('checked', 'true');
            }
        });
});

function changefont(){
     $.ajaxSetup({
          async : false
    });
    var fontId = $(".fontname").attr("id");
    $.post("/Seal/savechangefont",{"fontId":fontId,"fontname":$(".fontname").val(),"radioVal":$("input[name='isShowRadio']:checked").val()},function(data){
    if (data==1)
    {alert("修改成功");}
    else if(data==0)
    {alert("修改失败");}
    else if(data==2)
    {alert("该颜色已存在");}
    });
    getfont();
    $("#btncancle").click();
}

$("body").on("click","#btnAdd1",function(){
    if ($(this).val()=="添加"){
        addfont();
    }else if ($(this).val()=="确认修改") {
        changefont();
    }
})


//$("body").on("click",".deletefont",function(){
//    $.ajaxSetup({
//        async:false
//    });
//    var fontId = $(this).attr("id");
//    if (confirm("确认删除？")){
//        $.post("/Seal/deletefont",{"fontId":fontId,"isShowRadio1":$("input[name='isShowRadio1']").val()},function(data){
//            if (data==1)
//            alert("删除成功！");
//            else
//            alert("删除失败！");
//    })};
//    getfont();
//});




function getAdminName(){
    $.post("/Seal/getAdminName",function(data){
        var str=data;
        $("#adminName").append(str);
    })
}


