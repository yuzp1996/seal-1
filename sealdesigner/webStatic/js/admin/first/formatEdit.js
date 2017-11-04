$(function(){                    //页面加载时，();              //右上角管理员信息加载js相关函数
    $.cookie("page",1);          //默认当前页数为1
    getAdminName
    formatList();                //加载板式列表
	$(".uploadFormat").click(function(){   //点击上传样式按钮相当于点击了pictureFile按钮
		$("#pictureFile").click()
    })
	$("#pictureFile").change(function(){
    $(".imageArea").attr("src",getFileUrl("pictureFile"));
    })
})

/* 分 页 */
$("body").on("click",".pageNum",function(){
    if ( $.cookie("page")!=$(this).html()){  //判断点击的不是当前页
            $.cookie("page",$(this).html());
    }
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));    //表中信息超过十条，换页
    formatList();
})

/*上一页*/
$("body").on("click",".pageUp",function(){
    var num = $.cookie("page");
    $.cookie("page",num-1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    formatList();
})

/*下一页*/
$("body").on("click",".pageDown",function(){
    var num = parseInt($.cookie("page"));
    $.cookie("page",num+1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    formatList();
})



/*首页*/
$("body").on("click",".first",function(){
    $.cookie("page",1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    formatList();

})

 /*尾页*/
$("body").on("click",".Last",function(){
    $.cookie("page",Math.ceil($.cookie("pageCount")/10));
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    formatList();
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
    formatList();
})








//从本地获取input[file]图片的url Important
function getFileUrl(fileId) {
    var url;
    var file = document.getElementById(fileId);
    var agent = navigator.userAgent;
    if (agent.indexOf("MSIE")>=1) {
    url = file.value;
    } else if(agent.indexOf("Firefox")>0) {
    url = window.URL.createObjectURL(file.files.item(0));
    } else if(agent.indexOf("Chrome")>0) {
    url = window.URL.createObjectURL(file.files.item(0));
    }
    return url;
}

/*点击弹窗中的添加按钮或保存修改按钮触发的事件*/
$("body").on("click","#btnAdd",function(){
    if ($(this).val()=="添加"){
        formatSave();
    }
    else if ($(this).val()=="保存修改") {
        formatChange();
    }
})

//保存样式信息
function formatSave(){
	var ispicture=submit_upload_picture();
	var information = $(".informationList");  //获取印章配置信息
	var informationRemark = $(".informationListRemark");  //获取印章配置信息备注
	var informationLength=0;
	for(i=0;i<information.length;i++)
	{
		var informationName = information.eq(i).val(); // eq()是Jquery中获取索引的方法
		var informationMemo = informationRemark.eq(i).val(); // eq()是Jquery中获取索引的方法
	    if (informationName==""){
	        continue;  //开始循环的一个新迭代
	    }
//		alert(informationLength);
		var informationIndex="informationList"+informationLength;
		var informationMemoIndex="informationMemo"+informationLength;
		information.eq(i).attr("name",informationIndex);//把对应的不为空的文本框的name赋值
		informationRemark.eq(i).attr("name",informationMemoIndex);//把对应的不为空的文本框的name赋值
		informationLength++;
	}
	if(ispicture==1)
	{
		$("#pictureForm").attr("action","formatSave");
		$.ajaxSetup({
	    });
        $("#pictureForm").ajaxSubmit
        ({
            resetForm:false,
            dataType:'json',
           success:function(data){
             if (data==1)
             {
             	alert("添加成功");
             	window.location.reload();    //保存成功后页面重载
             }
             else if(data=="2")
             {
             	alert("已存在");
             	return false;
             }
             else
             {
             	alert("添加失败");
             	return false;
             }
             location.href="formatEdit";
             }
        });
     }
     else
     {
     	alert("图片类型必须是.gif,jpeg,jpg,png中的一种");
     }
}

/*修改样式信息*/
function formatChange(){
    if(/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test($("#pictureFile").val())|$("#pictureFile").val()=="")
     {
     	var str =""
        $("#pictureForm").attr("action","changeFormatInfo");
        var formatId = $("#formatId").val();
        str+= "<input type='text' name='formatId' value="+formatId+" style='display:none'>"
        var formatInformationId=$("input[name='btnSub']"); //获取配置信息id
		var information = $(".informationList");  //获取印章配置信息
		var informationRemark = $(".informationListRemark");  //获取印章配置信息备注
		var informationLength=0;
		for(i=0;i<information.length;i++)
		{
			var informationId = formatInformationId.eq(i).attr("id");  //获取每一条配置信息的id
			var informationName = information.eq(i).val(); // eq()是Jquery中获取索引的方法
			var informationMemo = informationRemark.eq(i).val(); // eq()是Jquery中获取索引的方法
			if (informationName==""){
				continue;  //开始循环的一个新迭代
			}
			var informationIndex="informationAndMemo"+informationLength;  //信息和备注的索引
			informationLength++;
			informationAndMemo=informationId+","+informationName+","+informationMemo;  //信息和备注由信息id、信息名称、备注拼成字符串
			str += "<input type='text' name="+informationIndex+" value="+informationAndMemo+" style='display:none'>"  //放入文本框对应的name和value中
		}
		$(".informationAndMemo").append(str);   //将js添加的文本框追加到informationAndMemo的div中
         $.ajaxSetup({});
         $("#pictureForm").ajaxSubmit({
             resetForm:false,
             dataType:'json',
             success:function(data){
             if(data==1)
               {
               		alert("修改成功");
               		location.reload();
               }
             else
				 if (data==2)
					 {alert("样式信息已存在");}
				 else
					alert("修改失败");
					return false;
             }

         });
     }
     else
     {
     	alert("图片类型必须是.gif,jpeg,jpg,png中的一种");
     }
}

//判断图片类型
function submit_upload_picture()
{
	var file = $('#pictureFile').val();
	if(/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(file)){
	    return 1;
	}else{
	    return 0;
	 }
}

/*打印材质列表*/
function formatList(formatId)
{
	var jsonStr = {};
    if (formatId!=""){
        jsonStr = $.extend({},jsonStr,{"formatId":formatId});  //字符串拼接
    }
    jsonStr = $.extend({},jsonStr,{"page":$.cookie("page")});
    $.post("/Seal/getFormatEditList",jsonStr,function(data){
        var jsonData=$.parseJSON(data);
        var str="";
        for(var i in jsonData){
            var informationNameStr = ""
            var informationNameLength = 1;
            var informationName = "";
            var formatId = "";
            var isShow = "";
            formatPictureUrl=jsonData[i]["format"].pictureUrl   //数组承载定量时不加引号,这里相当于二位数组
            formatId = jsonData[i].format.formatId
            isShow = jsonData[i].format.isShow
            for (var j=0;;j++){
               var formatInformationIndex = "information"+j;
               if (jsonData[i][formatInformationIndex]==undefined){
                    break;
               }else {
                    informationName=jsonData[i][formatInformationIndex].informationName;  //数组承载变量时不加引号
                    informationNameStr += "<tr><td style='border-top:0 none;'>"+informationName+"</td></tr>"
                    informationNameLength++;
               }
            }
            //保存的时候，已经把每条板式信息的id赋给修改
            str += "<tr><td rowspan="+informationNameLength+">"+"<img src="+formatPictureUrl+" style='max-width:80px;min-width:50px; height:60px; border:1px solid #777;' />"+"</td><td style='height: 0px;border: 0 none;'></td><td rowspan="+informationNameLength+">"+isShow+"</td>";
            str += "<td rowspan="+informationNameLength+"><a href='#modal-container-183169' data-toggle='modal' class='Look' id="+formatId+"><i class='icon-eye-open'></i>查看</a><a href='#modal-container-183169' data-toggle='modal' class='Change' id="+formatId+" style='margin-left:12px;'><i class='icon-edit'></i>修改</a></td>"
            str += "</tr>"+informationNameStr;
        }
        $(".format").empty().append(str);
        $.cookie("pageCount",jsonData[i].format.num);
        if (jsonData[i].format.num!=0){
            $(".page").empty().append(pageJs(jsonData[i].format.num,10));    //加载分页列表
        }
    })
}

/*点击添加板式信息*/
$("body").on("click","#btnA",function(){
    $(".imageArea").empty();        //初始化
    $(".btnControl").hide();
    $(".formatTable").show();
    $("#btnAdd").show();
    $("input[type='text']").removeAttr("readonly");
    $("input[name='isShowRadio']:first").attr('checked', 'true');
	$(".informationList").val("");
	$(".informationListRemark").val("");
	while (1)    //一直循环，清除多余的附件框
	{
		var boxes =$("input[type='text']");  //取所有文本框
		if (boxes.length/2<=1){
			break;                            //如果没有文本框，则跳出循环
		}
		else{
			var tr = boxes[0].parentNode.parentNode;
			tr.remove();                       //删除tr节点
			$("input[type='text']").val("");    //清空文本框里的值
		}
	}
	$("#btnAdd").val("添加");
})

/*触发遮罩窗体*/
/*添加印章配置信息*/
$("body").on("click",".formatInformationAdd",function(){
    var str = ""
    str += "<tr><th>配置信息:</th>"
	str+="<td style='border:;'><input type='text' name='test' class='informationList' style='margin-left:10px;width:150px;margin-top:5px;'></td>"
    str+="<td style='border:0;'>&nbsp;&nbsp;&nbsp;&nbsp;备注</td>"
    str+="<td style='border:0;'><input type='text' name='test' class='informationListRemark' style='margin-left:10px;width:150px;margin-top:5px;'></td>"
    str += "<td style='border:0;'><input type='button' "
    if ($("#btnAdd").val()=="保存修改"){  //当修改信息时，点击添加一条附加，后台将生成一条id给这个新的附件
        $.post("/Seal/getOneDataTypeId",function(data){
        str=str+"id="+data;
        })
    }
    str +=  " value='-' name='btnSub' style='width:35px; margin-left:10px; font-size:30px;'></td>"
    $(".formatInformation").after(str);
})

/*点击查看*/
$("body").on("click",".Look",function(){
    ChangeAndLook($(this).attr("id"),1);
    $("#btnAdd").hide();
    $(".btnControl").hide();
	$(".formatInformationAdd").hide();
})

/*点击修改*/
$("body").on("click",".Change",function(){
    ChangeAndLook($(this).attr("id"),2);  //传一个id参数给调用的函数
    $("#btnAdd").val("保存修改");
    $(".btnControl").show();
    $(".sealFormatInformation").show();
    $("#btnAdd").show();
    $("input[type='text']").removeAttr("readonly");
	$("b").show();
	$(".formatInformationAdd").show();
})

/*修改和查看*/
function ChangeAndLook(formatId,openStyle){
    var str ="";
    $.post("/Seal/formatInfoOne",{"formatId":formatId},function(data){
        var jsonData = $.parseJSON(data);  //parseJSON()函数用于将格式完好的JSON字符串转为与之对应的JavaScript对象。
        var str = "";
        while (1)    //一直循环，清除多余的附件框
        {
            var boxes =$("input[type='text']");  //取所有文本框
        	if (boxes.length==0){
        		break;                            //如果没有文本框，则跳出循环
        	}
        	else{
        		var tr = boxes[0].parentNode.parentNode;
            	tr.remove();                       //删除tr节点
        	}
        }
        for (var i in jsonData){   //遍历循环，遍历一次，执行一次循环，进行一次判断。
            if (jsonData[i].informationName==null){
//            	alert(jsonData[i].formatPictureUrl)
				$("#formatId").val(jsonData[i].formatId);   //获取formatId并存到隐藏域中
				$(".imageArea").empty().append('<img src='+jsonData[i].formatPictureUrl+' style="width:100%; height:100%;">')      //获取图片url并在img中显示,并且下次先进行清空
                if(jsonData[i].isShow){
                    $("input[name='isShowRadio']:first").attr('checked', 'true');
                }else{
                    $("input[name='isShowRadio']:last").attr('checked', 'true');
                }
            }
            else{
                str += "<tr><th>配置信息:</th><td style='border:0;'><input type='text' name='test' class='informationList' value="+ jsonData[i].informationName+" style='margin-left:10px;width:150px;margin-top:5px;'>"
				str+="<td style='border:0;'>&nbsp;&nbsp;&nbsp;&nbsp;备注</td>"
    			str+="<td style='border:0;'><input type='text' name='test' class='informationListRemark' value='"+jsonData[i].informationMemo+"' style='margin-left:10px;width:150px;margin-top:5px;'></td>"
                str += "<td style='border:0;'><input type='button' value='-' id="+jsonData[i].formatInformationId+" name='btnSub' style='width:35px; margin-left:10px; font-size:30px;'></td></tr>";
            }
        }
        $(".formatInformationFirst").remove();
        $(".formatInformation").after(str);
        if (openStyle==1){
        	$("input[type='text']").attr("readonly","readonly");      //如果点击查看，文本框是只读的
			$("input[name='btnSub']").hide();
        }
    })
}

/*删除板式*/
$("body").on("click","input[name='formatInformationSub']",function(){
    if (confirm("删除板式图片会删除该板式所有相关信息，\r\n是否确认删除板式图片?")) {
        var formatId = $("#formatId").val();
        $.post("/Seal/deleteFormat",{"formatId":formatId},function(data){
            if (data==1){
                alert("删除成功！");
                window.location.reload(true);    //页面重新加载
            }else if (data==2){
                alert("该板式已经被使用!")
                return ;
            }
            else {
                alert("删除失败，请稍候再试！");
                return ;
            }
        })
    }
})

/*删除某配置信息*/
$("body").on("click","input[name='btnSub']",function(){
    if(confirm("确认删除该配置信息？")){
        if ($("#btnAdd").val()=="保存修改"){
            var formatInformationId = $(this).attr("id")   //attr 用于获取属性的值
            $.post("/Seal/deleteFormatInfomation",{"formatInformationId":formatInformationId},function(data){
                if (data==1){
                    alert("配置信息删除成功！");
                    location.reload();
                }
                else{
                	alert("删除失败");
                }
            })
            formatList();
        }
        $(this).parent().parent().remove()
    }
})

/*获取管理员帐号，显示与右上角*/
function getAdminName(){
    $.post("/Seal/getAdminName",function(data){          //传给getAdminName
        var str=data;
        $("#adminName").append(str);
    })
}