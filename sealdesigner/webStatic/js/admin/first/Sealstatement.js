$(function(){
    $.cookie("page",1);       //默认当前页数为1
    getAdminName();            //右上角管理员信息
    statementList();
    statementDataTypeList("");            //调用statementDataTypeList方法
})

/*数据库调取分页*/
/* 分 页 */
$("body").on("click",".pageNum",function(){
    if ( $.cookie("page")!=$(this).html()){  //判断点击的不是当前页
            $.cookie("page",$(this).html());
    }
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    statementDataTypeList("");
})
/*上一页*/
$("body").on("click",".pageUp",function(){
    var num = $.cookie("page");
    $.cookie("page",num-1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    statementDataTypeList("");
})
/*下一页*/
$("body").on("click",".pageDown",function(){
    var num = parseInt($.cookie("page"));
    $.cookie("page",num+1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    statementDataTypeList("");
})

/*二次刻章声明主界面*/
/*刻章声明下拉列表*/
function statementList(){
    $.post("/Seal/statementList",function(data){
        var jsonData = $.parseJSON(data);
        var str = "<option value='0'>所有</option>";
        for (i in jsonData){
            str += "<option value="+jsonData[i].statementId+">"+jsonData[i].statementContent+"</option>"
        }
        $(".statementChoose").append(str);
    })
}

/*按刻章声明分类查询*/
$("body").on("change",".statementChoose",function(){
    if ($(this).val()==0){
        statementDataTypeList("");
    }else {
        var statementId = $(this).val();
        statementDataTypeList(statementId);  //调用函数，并传一个参数
    }
})

/*打印二次刻章声明信息*/
function statementDataTypeList(statementId){
    var jsonStr = {};
    if (statementId!=""){
        jsonStr = $.extend({},jsonStr,{"statementId":statementId});  //字符串拼接
    }
    jsonStr = $.extend({},jsonStr,{"page":$.cookie("page")});
    $.post("/Seal/statementDataTypeList",jsonStr,function(data){  //把声明id post给后台查找这个id下的所有附件信息
        var jsonData=$.parseJSON(data);
        var str="";
        for (var i in jsonData){
            var dataName = "";
            var dataNameStr = "";
            var dataTypeLength = 1;
            var statementId = "";
            var statementName = "";
            var isShow = "";
            statementName=jsonData[i]["statement"].statementName   //数组承载定量时不加引号,这里相当于二位数组
            statementId = jsonData[i].statement.statementId
            isShow = jsonData[i].statement.isShow
            for (var j=0;;j++){
               var dataTypeInfoList = "dataTypeInfoList"+j;
               if (jsonData[i][dataTypeInfoList] == undefined){
                    break;
               }else {
                    dataName=jsonData[i][dataTypeInfoList].dataName;  //数组承载变量时不加引号
                    dataNameStr += "<tr><td style='border-top:0 none;'>"+dataName+"</td></tr>"
                    dataTypeLength++;
               }
            }
            //保存的时候，已经把每条声明的id赋给修改
            str += "<tr><td rowspan="+dataTypeLength+">"+statementName+"</td><td  style='height: 0px;border: 0 none;'></td><td rowspan="+dataTypeLength+">"+isShow+"</td>";
            str += "<td rowspan="+dataTypeLength+"><a href='#modal-container-722' data-toggle='modal' class='statementLook' id="+statementId+"><i class='icon-eye-open'></i>查看</a><a href='#modal-container-722' data-toggle='modal' class='statementChange' id="+statementId+" style='margin-left:12px;'><i class='icon-edit'></i>修改</a></td>"
            str += "</tr>"+dataNameStr;
        }
        $(".statementLists").empty().append(str);
        $.cookie("pageCount",jsonData[i].statement.num);
        if (jsonData[i].statement.num!=0){
            $(".page").empty().append(pageJs(jsonData[i].statement.num,10));    //加载分页列表
        }
    })
}

/*点击添加声明*/
$("body").on("click",".stateBtn",function(){
    $(".btnStatementAdd").show();  //添加
    $(".sealStatementNeed").show();  //所需附件
    $("input[type='text']").removeAttr("readonly");  //输入框可读写
    $(".sealStatementInput").val("");
    $(".statementName").val("");
    $("input[name='isShowRadio']:first").attr('checked',true);
    $(".btnControl").hide();   //刻章声明
    var InfoListLength = document.getElementsByName("test");
	while (0<InfoListLength.length)
	{
	    var tr = InfoListLength[0].parentNode.parentNode;
        tr.remove();
	}
	$(".btnStatementAdd").val("添加");
})

/*点击修改*/
$("body").on("click",".statementChange",function(){
    btnLookAndChange($(this).attr("id"),1);
})

/*点击查看*/
$("body").on("click",".statementLook",function(){
    btnLookAndChange($(this).attr("id"),2);
})

/*点击查看和修改*/
function btnLookAndChange(statementId,openType){
    var str ="";
    $.post("/Seal/sealStatementInfoOne",{"statementId":statementId},function(data){
        var jsonData = $.parseJSON(data);  //parseJSON()函数用于将格式完好的JSON字符串转为与之对应的JavaScript对象。
        var str = "";
        var boxes = document.getElementsByName("test");  //返回带有指定名称的对象的集合
        while (0<boxes.length)    //清除多余的附件框
        {
            var tr = boxes[0].parentNode.parentNode;
            tr.remove();
        }
        for (var i in jsonData){   //遍历循环，遍历一次，执行一次循环，进行一次判断。
            if (jsonData[i].statementName!=null){
                $(".sealStatementInput").val(jsonData[i].statementName);  //企业类型输入框的值设置为企业的名称
                $(".dataTypeId").val(jsonData[i].statementId);  //把声明的id赋值给隐藏域
                if(jsonData[i].isShow){
                    $("input[name='isShowRadio']:first").attr('checked', 'true');
                }else{
                    $("input[name='isShowRadio']:last").attr('checked', 'true');
                }
            }else{
                str += "<tr><th>附件名:</th><td style='border:0;'><input type='text' class='statementName' name='test' value="+ jsonData[i].dataName+" style='margin-left:10px;width:150px;margin-top:5px;'>"
                str += "</td><td style='border:0;'><input type='button' value='-' id="+jsonData[i].dataTypeId+" name='statementSub'></td></tr>";
            }
        }
        $(".statementNameFirst").remove();
        $(".statementInfoAppend").after(str);
        if (openType==1){
            $(".btnControl").show();
            $(".btnStatementAdd").show();
            $("input[name='statementSub']").show();
            $(".sealStatementNeed").show();
            $(".btnStatementAdd").val("保存修改")
            $("input[type='text']").removeAttr("readonly");
        }else{
            $(".btnStatementAdd").hide();
            $(".btnControl").hide();
            $("input[name='statementSub']").hide();
            $(".sealStatementNeed").hide();
            $("input[type='text']").attr("readonly","readonly");
        }
    })
}


/*触发遮罩窗体*/
/*点击弹窗中的添加按钮或保存修改按钮触发的事件*/
$("body").on("click",".btnStatementAdd",function(){
    if ($(this).val()=="添加"){
        sealStatementSave();
    }else if ($(this).val()=="保存修改") {
        sealStatementChange();
    }
})

/*保存修改的声明信息*/
function sealStatementChange(){
    var jsonStr = {};
    var statementId = $(".dataTypeId").val();  //声明id
    var statementName = $(".sealStatementInput").val(); // 声明名称
    if (statementName ==""){
        alert("刻章声明不能为空，请重新输入！")
        return;
    }
    jsonStr = $.extend({},jsonStr,{"statementName":statementName},{"statementId":statementId});
    var dataName = $("input[name='test']");  //附件名
    var dataId = $("input[name='statementSub']");
    var length = 0;
    for(i=0;i<dataName.length;i++){
        var dataTypeName = dataName.eq(i).val() // 获取索引
        var dataTypeId = dataId.eq(i).attr("id");
        if (dataTypeName==""){
	        alert("附件名不能空，请确认后再修改！");
	        return ;
	    }
	    var json = {};
	    var dataTypeNameIndex = "dataName"+i;
	    var dataTypeIdIndex = "dataTypeId"+i;
        json[dataTypeNameIndex] = dataTypeName;  //键值对
        json[dataTypeIdIndex] = dataTypeId;
	    jsonStr = $.extend({},jsonStr,json);
	    length++;
    }
    if (length==0){
	    alert("所需附件不能全部为空！");
	    return ;
	}
    jsonStr=$.extend({},jsonStr,{"radioVal":$("input[name='isShowRadio']:checked").val()});
	$.post("/Seal/changeStatementInfo",jsonStr,function(data){
	    if (data=="1"){
	        alert("保存成功！");
	        window.location.reload();    //保存成功后页面重载
	        return;
	    }else if (data=="2"){
	        alert("当前刻章声明已存在！");
	        return ;
	    }else {
	        alert("保存失败，请稍后重试！");
	        return ;
	    }
	})
}


/*添加声明信息*/
function sealStatementSave(){
    var jsonStr = {};
    var statementContentVal = $(".sealStatementInput").val();   //刻章声明名称
    if (statementContentVal==""){
        alert("刻章声明不能为空，请重新输入！");
        return;
    }
    jsonStr = $.extend({},jsonStr,{"sealStatementInput":statementContentVal});
    var dataNameLength = 0;
    var dataName = $(".statementName");
    for (i=0;i<dataName.length;i++){
        var dataNameVal = dataName.eq(i).val();    //获取索引
        if (dataNameVal==""){
            continue;
        }
        var dataNameIndex="dataName"+dataNameLength;
        var json = {}       //定义新的字符串重载循环的值
        json[dataNameIndex] = dataNameVal
	    jsonStr = $.extend({},jsonStr,json);
	    dataNameLength++;
    }
    if(dataNameLength == 0){
        alert("刻章声明附件不能全部为空，请重新输入！");
        return;
    }
    jsonStr=$.extend({},jsonStr,{"radioVal":$("input[name='isShowRadio']:checked").val()});
    $.post("/Seal/sealStatementInfoSave",jsonStr,function(data){
	    if (data=="1"){
	        alert("保存成功！");
            window.location.reload();    //页面重载
	    }else if (data=="2"){
	        alert("刻章声明已存在！");
	        return ;
	    }else {
	        alert("保存失败，请稍后重试！");
	        return ;
	    }
    })
}

/*附件追加*/
$("body").on("click",".statementInfoAdd",function(){
    var str = ""
    str += "<tr><th>附件名:</th>"
    str += "<td style='border:0;'><input type='text' class='statementName' name='test' style='margin-left:10px;width:150px;margin-top:5px;'></td>"
    str += "<td style='border:0;'><input type='button'"
    if ($(".btnStatementAdd").val()=="保存修改"){  //当修改信息时，点击添加一条附加，后台将生成一条id给这个新的附件
        $.post("/Seal/getOneStatementId",function(data){
            str += "id="+data;
            str += " value='-' name='statementSub'></td></tr>";
            $(".statementInfoAppend").after(str);
        })
    }else{
        str += " value='-' name='statementSub'></td></tr>";
        $(".statementInfoAppend").after(str);
    }
})

/*删除附件*/
$("body").on("click","input[name='statementSub']",function(){
    var testInput = $(".statementName").length;
    if(testInput==1){
        alert("至少保留一个附件！");
        return;
    }
    if (confirm("确认删除?")) {
        if ($(".btnStatementAdd").val()=="保存修改"){
            var dataTypeId = $(this).attr("id")   //attr 用于获取属性的值
            $.post("/Seal/statementOneDelete",{"dataTypeId":dataTypeId},function(data){
                if (data==1){
                    alert("附件删除成功！");
                    return;
                }
                else if(data==2){
                    alert("附件信息不存在，请刷新后操作!");
                    return;
                }
                else{
                    alert("附件删除失败！");
                    return;
                }
                statementDataTypeList("");
            })
        }
        $(this).parent().parent().remove()
    }
})

/*删除某刻章声明*/
$("body").on("click","input[name='sealStatementSub']",function(){
    if (confirm("一旦删除将无法恢复，是否\r\n确认删除该刻章声明?")) {
        var statementId = $(".dataTypeId").val()
        $.post("/Seal/oneStatementDelete",{"statementId":statementId},function(data){
            if (data==1){
                alert("删除成功！");
                window.location.reload(true);    //页面重新加载
            }else if (data==2){
                alert("刻章声明不存在，请确认后再操作")
                return ;
            }else {
                alert("删除失败，请稍候再试！");
                return ;
            }
        })
    }
})


/*获取管理员帐号，显示于右上角*/
function getAdminName(){
    $.post("/Seal/getAdminName",function(data){
        var str=data;
        $("#adminName").append(str);
    })
}