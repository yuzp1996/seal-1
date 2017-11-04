
$(function(){
    $.cookie("page",1);       //默认当前页数为1
    getAdminName();            //右上角管理员信息
    companyList();             //调用companyList方法，加载企业类型下拉列表
    datatypeList("");            //调用datatypeList方法，加载企业信息列表
})
/*数据库调取分页*/
/* 分 页 */
$("body").on("click",".pageNum",function(){
    if ( $.cookie("page")!=$(this).html()){  //判断点击的不是当前页
            $.cookie("page",$(this).html());
    }
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    datatypeList("")
})
/*上一页*/
$("body").on("click",".pageUp",function(){
    var num = $.cookie("page");
    $.cookie("page",num-1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    datatypeList("");
})

/*下一页*/
$("body").on("click",".pageDown",function(){
    var num = parseInt($.cookie("page"));
    $.cookie("page",num+1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    datatypeList("");
})

/*企业类型主界面*/
/*企业类型下拉列表*/
function companyList(){
    $.post("/Seal/companyList",function(data){
        var jsonData = $.parseJSON(data);  //jquery.parseJSON()将格式完好的JSON字符串转为与之对应的JavaScript对象
        var str = "<option value='0'>所有</option>";
        for (i in jsonData){
            str += "<option value="+jsonData[i].companyId+">"+jsonData[i].companyName+"</option>"
        }
        $.ajaxSetup({
          async : false     //ajax同步，默认为false异步
        });
        $(".epChoose").append(str);
    })
}

/*按企业类型分类查询*/
$("body").on("change",".epChoose",function(){
    if ($(this).val()==0){
        datatypeList("");
    }else {
        var companyId = $(this).val();
        datatypeList(companyId);
    }
})

/*打印十条企业信息*/
function datatypeList(companyId){   //函数有参，调用必须要值！即使为空！
    var jsonStr = {};
    if (companyId!=""){
        jsonStr = $.extend({},jsonStr,{"companyId":companyId});  //字符串拼接
    }
    jsonStr = $.extend({},jsonStr,{"page":$.cookie("page")});
    $.post("/Seal/datatypeList",jsonStr,function(data){
        var jsonData=$.parseJSON(data);
        var str="";
        for(var i in jsonData){
            var dataNameStr = ""
            var dataTypeLength = 1;
            var dataName = "";
            var companyId = "";
            var isShow = "";
            var companyName = "";
            companyName=jsonData[i]["company"].companyName   //数组承载定量时不加引号,这里相当于二位数组
            companyId = jsonData[i].company.companyId
            isShow = jsonData[i].company.isShow
            for (var j=0;;j++){
               var dataTypeInfoList = "dataTypeInfoList"+j;
               if (jsonData[i][dataTypeInfoList]==undefined){
                    break;
               }else {
                    dataName=jsonData[i][dataTypeInfoList].dataName;  //数组承载变量时不加引号
                    dataNameStr += "<tr><td style='border-top:0 none;'>"+dataName+"</td></tr>"
                    dataTypeLength++;
               }
            }
            //保存的时候，已经把每条企业类型的id赋给修改
            str += "<tr><td rowspan="+dataTypeLength+">"+companyName+"</td><td style='height: 0px;border:0 none;'></td><td rowspan="+dataTypeLength+">"+isShow+"</td>";
            str += "<td rowspan="+dataTypeLength+"><a href='#modal-container-123456' data-toggle='modal' class='enpLook' id="+companyId+"><i class='icon-eye-open'></i>查看</a><a href='#modal-container-123456' data-toggle='modal' class='enpChange' id="+companyId+" style='margin-left:12px;'><i class='icon-edit'></i>修改</a></td>"
            str += "</tr>"+dataNameStr;
        }
        $(".lists").empty().append(str);
        $.cookie("pageCount",jsonData[i].company.num);
        if (jsonData[i].company.num!=0){
            $(".page").empty().append(pageJs(jsonData[i].company.num,10));    //加载分页列表
        }
    })
}

/*点击弹窗中的添加按钮或保存修改按钮触发的事件*/
$("body").on("click",".btn-add",function(){
    if ($(this).val()=="添加"){
        companySave();
    }else if ($(this).val()=="保存修改") {
        changeSave();
    }
})

/*点击添加企业类型*/
$("body").on("click",".addButton",function(){
    $(".ep-type").val("");        //初始化
    $(".ep-informationList").val("");
    $(".btnControl").hide();
    $(".enterPriseNeed").show();
    $(".btn-add").show();
    $("input[type='text']").removeAttr("readonly");
    $("input[name='isShowRadio']:first").attr('checked', 'true');
    var boxes = document.getElementsByName("test");  //返回带有指定名称的对象的集合
	while (0<boxes.length)    //清除多余的附件框，只保留一个
	{
	    var tr = boxes[0].parentNode.parentNode;
        tr.remove();
	}
	$(".btn-add").val("添加");
})

/*点击修改*/
$("body").on("click",".enpChange",function(){
    btnAddAndLook($(this).attr("id"));  //传一个id参数给调用的函数
    $(".btn-add").val("保存修改");
    $(".btnControl").show();
    $(".enterPriseNeed").show ();
    $(".btn-add").show();
    $("input[type='text']").removeAttr("readonly");
})

/*点击查看*/
$("body").on("click",".enpLook",function(){
    btnAddAndLook($(this).attr("id"));
    $(".btn-add").hide();
    $(".btnControl").hide();
    $("input[name='enterpriseTypeSub']").hide();
    $(".enterPriseNeed").hide();
    $("input[type='text']").attr("readonly","readonly");
})

/*修改和查看*/
function btnAddAndLook(companyId){
    var str ="";
    $.post("/Seal/dataTypeInfoOne",{"companyId":companyId},function(data){
        var jsonData = $.parseJSON(data);  //parseJSON()函数用于将格式完好的JSON字符串转为与之对应的JavaScript对象。
        var str = "";
        var boxes = document.getElementsByName("test");
        while (0<boxes.length)    //清除多余的附件框，只保留一个
        {
            var tr = boxes[0].parentNode.parentNode;
            tr.remove();
        }
        for (var i in jsonData){   //遍历循环，遍历一次，执行一次循环，进行一次判断。
            if (jsonData[i].companyName!=null){
                $(".ep-type").val(jsonData[i].companyName);  //企业类型输入框的值设置为企业的名称
                $(".companyId").val(jsonData[i].companyId);
                if(jsonData[i].isShow){
                    $("input[name='isShowRadio']:first").attr('checked', 'true');
                }else{
                    $("input[name='isShowRadio']:last").attr('checked', 'true');
                }
            }else{
                str += "<tr><th>附件名:</th><td style='border:0;'><input type='text' name='test' class='ep-informationList' value="+ jsonData[i].dataName+" style='margin-left:10px;width:150px;margin-top:5px;'>"
                str += "</td><td style='border:0;'><input type='button' value='-' id="+jsonData[i].dataTypeId+" name='enterpriseTypeSub'></td></tr>";
            }
        }
        $(".ep-informationFirst").remove();
        $(".ep-information").after(str);
    })
}


/*保存修改信息*/
function changeSave(){
    var jsonStr = {};
    var companyName = $(".ep-type").val();
    var companyId = $(".companyId").val();  //获取企业类型id
    if (companyName==""){
        alert("企业类型不能为空，请重新输入！");
        return;
    }
    jsonStr = $.extend({},jsonStr,{"companyName":companyName},{"companyId":companyId});
    var enterprise = $("input[name='test']");
    var enterpriseTypeSub = $("input[name='enterpriseTypeSub']");
    var dataTypeNameIndexLength = 0;
    for(i=0;i<enterprise.length;i++){
        var dataTypeName = enterprise.eq(i).val() // 获取索引
        var dataTypeId = enterpriseTypeSub.eq(i).attr("id");
        if (dataTypeName==""){
	        alert("附件名不能空，请确认后再修改！");
	        return ;
	    }
	    var json = {};
	    var dataTypeNameIndex = "enterprise"+i;
	    var dataTypeIdIndex = "dataTypeId"+i;
        json[dataTypeNameIndex] = dataTypeName;  //键值对
        json[dataTypeIdIndex] = dataTypeId;
	    jsonStr = $.extend({},jsonStr,json);
	    dataTypeNameIndexLength++;
    }
    if (dataTypeNameIndexLength==0){
	    alert("所需附件不能全部为空！");
	    return ;
	}
	jsonStr=$.extend({},jsonStr,{"radioVal":$("input[name='isShowRadio']:checked").val()});
	$.post("/Seal/changeCompanyInfo",jsonStr,function(data){
	    if (data=="1"){
	        alert("保存成功！");
	        window.location.reload();    //保存成功后页面重载
	        return;
	    }else if (data=="2"){
	        alert("当前企业类型已存在！");
	        return ;
	    }else {
	        alert("保存失败，请稍后重试！");
	        return ;
	    }
	})
}

/*删除某企业类型*/
$("body").on("click","input[name='enpTypeSub']",function(){
    if (confirm("删除企业类型会删除该企业所有相关信息，\r\n是否确认删除该企业类型?")) {
        var companyId = $(".companyId").val()
        $.post("/Seal/companyOneDelete",{"companyId":companyId},function(data){
            if (data==1){
                alert("删除成功！");
                window.location.reload(true);    //页面重新加载
            }else if (data==2){
                alert("企业类型不存在，请刷新后再操作")
                return ;
            }else {
                alert("删除失败，请稍候再试！");
                return ;
            }
        })
    }
})

/*删除某附件*/
$("body").on("click","input[name='enterpriseTypeSub']",function(){
    var testInput = $(".ep-informationList").length;
    if(testInput==1){
        alert("至少保留一个附件！");
        return;
    }
    if(confirm("确认删除该附件？")){
        if ($(".btn-add").val()=="保存修改"){
            var dataTypeId = $(this).attr("id")   //attr 用于获取属性的值
            $.post("/Seal/dataTypeOneDelete",{"dataTypeId":dataTypeId},function(data){
                if (data==1){
                    alert("附件删除成功！");
                }
            })
            datatypeList("");
        }
        $(this).parent().parent().remove()
    }
})

/*触发遮罩窗体*/
/*添加附件*/
$("body").on("click",".enp-type-add",function(){
    var str = ""
    str += "<tr><th>附件名:</th>"
    str += "<td style='border:0;'><input type='text' name='test' class='ep-informationList' style='margin-left:10px;width:150px;margin-top:5px;'></td>"
    str += "<td style='border:0;'><input type='button' "
    if ($(".btn-add").val()=="保存修改"){  //当修改信息时，点击添加一条附加，后台将生成一条id给这个新的附件
        $.post("/Seal/getOneDataTypeId",function(data){
        str+="id="+data;
        })
    }
    str +=  " value='-' name='enterpriseTypeSub'></td></tr>"
    $(".ep-information").after(str);
})

/*添加企业类型及附件信息！*/
function companySave(){
    var jsonStr = {};
    var enterpriseTypeVal = $(".ep-type").val();  //获取企业名称
    if (enterpriseTypeVal==""){
        alert("企业类型不能为空，请重新输入！");
        return;   //返回主调函数
    }
    jsonStr = $.extend({},jsonStr,{"enterpriseType":enterpriseTypeVal});
    var enterprise = $(".ep-informationList");  //获取附件名称
    var enterpriseLength=0;
	for (i=0;i<enterprise.length;i++){
	    var enterpriseVal = enterprise.eq(i).val() // eq()是Jquery中获取索引的方法
	    if (enterpriseVal==""){
	        continue;  //开始循环的一个新迭代
	    }
	    var enterpriseIndex="enterprise"+enterpriseLength;
        var json = {}
        json[enterpriseIndex] = enterpriseVal
	    jsonStr = $.extend({},jsonStr,json);
	    enterpriseLength++;
	}
	if (enterpriseLength==0){
	    alert("所需附件不能全部为空！");
	    return ;
	}
	jsonStr=$.extend({},jsonStr,{"radioVal":$("input[name='isShowRadio']:checked").val()});
	$.post("/Seal/enterpriseInfoSave",jsonStr,function(data){
	    if (data=="1"){
	        alert("保存成功！");
	        window.location.reload();    //保存成功后页面重载
	        return;
	    }else if (data=="2"){
	        alert("企业类型已存在！");
	        return ;
	    }else {
	        alert("保存失败，请稍后重试！");
	        return ;
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