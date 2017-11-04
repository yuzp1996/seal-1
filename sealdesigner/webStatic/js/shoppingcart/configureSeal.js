$(function(){
	getSealInfo();       //获取印章信息
	sealUsedCompany();   //获取企业类型
	$(".proofList").hide();  //隐藏出示证明
	$(".resharpenReason").hide();         //隐藏重刻原因
	$("#resharpenReasonSelect").hide();
	$(".quantity").hide();                //隐藏商品数量
	$("#number").hide();
});

$("body").on("click","#companyTypeSelect option:first",function(){        //点击请选择，清空出示证明
	$(".companyProof").empty();
	$(".resharpenProof").empty();
});

$("body").on("click","#resharpenReasonSelect option:first",function(){   //点击请选择，清空重刻证明
	$(".resharpenProof").empty();
});

$("body").on("click","#shrpen",function(){                                  //点击初刻，清空重刻证明
	$(".resharpenProof").empty();
	$("#resharpenReasonSelect").val("0");                                     //将重刻原因设置为请选择
});

$("body").on("click","input[name='chooseStyle']",function(){
	getFormatInfor($(this).attr("id"));     //获取板式信息
});

$("body").on("click","input[name='uploadButton']",function(){
	$(this).next(".uploadFile").click();  //上传按钮紧邻的下一个按钮
});

$("body").on("click","input[name='uploadButton']",function(){
	var dataTypeId=$(this).parent(".proof").attr("id");        //li的id
	$(this).parent(".proof").prev(".dataTypeId").attr("value",dataTypeId);   //li的id赋给.dataType
});

$("body").on("change",".uploadFile",function(){  //change事件时向后台传文件
	$(".uploadFile").removeAttr("name");           //去除所有的uploadFile的name
	$(this).attr("name","file");                  //给点击的上传按钮追加name
	$(".dataTypeId").removeAttr("name");          //去除所有的uploadFile的name
	$(this).parent(".proof").prev(".dataTypeId").attr("name","dataTypeId");         //给.dataType按钮追加name
	var file = $(this).val();
	file = file.toLowerCase();
	if(/.(jpg|jpeg|png|gif|doc|docx|pdf|txt)$/.test(file)){
		uploadFile();
		$(this).prev("input[name='uploadButton']").attr("value","已上传");
	}else{
		alert("文件格式不正确，请上传docx或pdf或jpg格式文件！");
		return;
	 }
});

//上传文件（企业出示证明和重刻原因证明）
function uploadFile(){
	$("#seal_form").attr("action","/ShoppingCart/uploadFile");
//	$.ajaxSetup({});
	$("#seal_form").ajaxSubmit({           //ajax异步表单提交
		resetForm:false,
		dataType:'html',                    //html而不是json
		success:function(data){            //jquery版本高于1.3时，dataType不是严谨的json，不执行success
			$("#userDataId").attr("value",data);
		},
		error: function(e) {
			alert("上传失败!");
		}
	});
}

//获取商品信息
function getSealInfo(){
	$.post("getSealInfo",{"sealId":$("#goodsName").val()},function(data){
		var jsonData=$.parseJSON(data);
		var sealParentClassName="";
		var sealNameStr="";
		var sealpictureUrl="";
		var sealIntroduction="";
//		colorStr ="<option value="+jsonData[0].sealcolorId+">"+jsonData[0].sealcolorName+"</option>";
		var colorStr = "<option value="+jsonData[0].sealInfoBase.sealcolorId+">"+jsonData[0].sealInfoBase.sealcolorName+"</option>";
		var fontStr = "";
		var sealFormatStr="";
		for(var i in jsonData){
			sealNameStr+="<li class='item'>"+jsonData[i].sealInfoBase.sealParentClassName+"</li>";    //章材父类名称
			var sealParentClassName=jsonData[i].sealInfoBase.sealParentClassName;
			if(sealParentClassName=="公章"){
				officialSeal();
			}
			else if(sealParentClassName=="个人章"){
				personalSeal();
			}
			sealNameStr+="<li class='item'>"+jsonData[i].sealInfoBase.sealClassName+"</li>";               //章材子类名称
			sealpictureUrl="<img src="+jsonData[i].sealInfoBase.sealpictureUrl+" alt='' class='goodsPicture' />"; //商品图片
			sealIntroduction="<p>"+jsonData[i].sealInfoBase.sealIntroduction+"</p>";                   //章材介绍
			for(var sealFormatOne in jsonData[i].sealFormart){
				sealFormatStr+="<div class='stylePicture'><img id="+sealFormatOne+" src="+jsonData[i].sealFormart[sealFormatOne]+" alt='' class='picture' />";
				sealFormatStr+="<input type='radio' name='chooseStyle' id="+sealFormatOne+" class='chooseStyle' style='margin:0 50%;' /></div>";
			}
//获取颜色
			for (var colorOne in jsonData[i].color){
				colorStr +="<option value="+colorOne+">"+jsonData[i]["color"][colorOne]+"</option>";
			}
//获取字体
			for (var fontOne in jsonData[i].font){
				fontStr +="<option value="+fontOne+">"+jsonData[i]["font"][fontOne]+"</option>";
			}
		}
		$(".selected").after(sealNameStr);    //已选条件
		$(".goods").append(sealpictureUrl);   //商品图片
		$(".goods").after(sealIntroduction);  //商品介绍
		$(".sealStyle").after(sealFormatStr);
		$("#colorSelect").append(colorStr);
		$("#fontSelect").append(fontStr);
		$("input[name='chooseStyle']").eq(0).attr("checked",true);   //让第一个radio默认选中
		getFormatInfor($("input[name='chooseStyle']:first").attr("id"));  //获取第一个radio的id
		var styleId=$("input[name='chooseStyle']:first").attr("id");  //生成效果图片
		var stylePic=$(".picture:first").attr("src");
		$("#generationEffect").click(function(){
			$(".sealPicture").attr("id",styleId);
			$(".sealPicture").attr("src",stylePic);
		});
		$("#generationEffect").next().attr("id",styleId);
		$("#generationEffect").next().attr("value",stylePic);
	})
};

//获取板式配置信息
function getFormatInfor(formatId){
	$.post("getFormatInfor",{"formatId":formatId},function(data){
		var jsonData=$.parseJSON(data);
		var formatStr = "";
		for(var i in jsonData){
			formatStr+="<li class='companyName'><label class='leftLabel'>"+jsonData[i].informationName+":</label>";
			formatStr+="<input type='text' class='informationList' />";
			formatStr+="<label class='remark' style='width:50px;margin-left:5px;'>备注:"+jsonData[i].informationMemo+"</label>";
			formatStr+="<input type='hidden' class='formatInformationList' value="+jsonData[i].formatInformationId+" /></li>";
		}
		$(".formatInformation").empty().append(formatStr);  //获取板式信息
	})
};

//获取企业类型
function sealUsedCompany(){
		$.post("sealUsedCompany",{"sealId":$("#goodsName").val()},function(data){
		var jsonData=$.parseJSON(data);
		var companyStr = "";
		for(var i in jsonData){                       //第一次取{"id":"name"}
			for (var companyOne in jsonData[i]){               //第二次取id
				companyStr +="<option value="+companyOne+">"+jsonData[i][companyOne]+"</option>";
				}
			}
		$("#companyTypeSelect").append(companyStr);
	})
};

//与企业类型相关的出示证明
$("body").on("change","#companyTypeSelect",function(){
	var companyTypeValue=$('#companyTypeSelect').val();
	if(companyTypeValue!=0){
		$(".proofList").show();
	}
	$.post("getCompanyInfo",{"companyId":$("#companyTypeSelect").val()},function(data){
		var jsonData=$.parseJSON(data);
		var companyStatementStr="";
		for(var i in jsonData){
			companyStatementStr+="<input type='text' class='dataTypeId hidden' /><li id="+jsonData[i].dataTypeId+" class='proof'>"+jsonData[i].dataName+"<input type='button' name='uploadButton' value='上传' />";
			companyStatementStr+="<input type='file' class='uploadFile hidden' /></li>";
			$(".companyProof").empty().append(companyStatementStr);
		}
	})
});


//重刻原因
$.post("getStatementList",function(data){
	//		alert(data)
	var jsonData=$.parseJSON(data);
	var StatementListStr="";
	for(var i in jsonData){
		StatementListStr+="<option value="+jsonData[i].statementId+">"+jsonData[i].statementContent+"</option>";
	}
	$("#resharpenReasonSelect").append(StatementListStr);
});


//与重刻原因相关的出示证明
$("body").on("change","#resharpenReasonSelect",function(){
	$.post("getStatementInfo",{"statementId":$("#resharpenReasonSelect").val()},function(data){
//		alert($("#resharpenReasonSelect").val())
//		alert(data)
		var jsonData=$.parseJSON(data);
		var resharpenStatementStr="";
		for(var i in jsonData){
			resharpenStatementStr+="<input type='text' class='dataTypeId hidden' /><li id="+jsonData[i].dataTypeId+" class='proof'>"+jsonData[i].dataName+"<input type='button' name='uploadButton' value='上传' />";
			resharpenStatementStr+="<input type='file' class='uploadFile hidden'  /></li>";
		}
		$(".resharpenProof").empty().append(resharpenStatementStr);
	});
});


//将用户输入的信息保存
function saveTrolley(){
	var returnValue=""
	var jsonStr = {};
	jsonStr["materialId"] = $("#goodsName").val();                 //商品id
	jsonStr["colorId"]=$("#colorSelect").val();                    //颜色id
	jsonStr["fontId"]=$("#fontSelect").val();                      //字体id
	jsonStr["companyId"]=$("#companyTypeSelect").val();           //企业id
	jsonStr["styleId"]=$("#generationEffect").next().attr("id")   //效果图片id
	jsonStr["stylePic"]=$("#generationEffect").next().val();      //效果图片url
	jsonStr["number"]=$("#number").val();                          //数量
	jsonStr["userDataId"]=$("#userDataId").val();                 //用户资料id
	jsonStr["statementId"]=$("#resharpenReasonSelect").val();    //重刻原因id
//配置信息
	var formatInformationList = $(".formatInformationList");  //获取印章配置信息id
	var informationList = $(".informationList");              //获取印章配置信息名称
	var informationLength=0;
	for(i=0;i<informationList.length;i++)
	{	var json = {};
		var formatInformationId = formatInformationList.eq(i).val();  //获取每一条配置信息的id
		var informationContent = informationList.eq(i).val();         // eq()是Jquery中获取索引的方法
		if (informationContent==""){
			continue;  //开始循环的一个新迭代
		}
		var InformationIndex="information"+informationLength;  //配置信息id和内容的索引
		informationLength++;
		information=formatInformationId+","+informationContent;  //信息由信息id、信息内容拼成字符串
		json[InformationIndex] = information;
		jsonStr=$.extend({},jsonStr,json);    //配置信息
	}
	$.ajaxSetup({
          async : false
        });
	$.post("saveTrolley",jsonStr,function(data){
		returnValue=data;
	});
	return returnValue;
};

//公章
function officialSeal(){
	$(":radio[name='shrpenSeal']").click(function(){  //初刻隐藏重刻原因，重刻显示重刻原因
		var index=$(":radio[name='shrpenSeal']").index($(this));
		if(index==1){
			$(".resharpenReason").show();
			$("#resharpenReasonSelect").show();
		}
		else{
			$(".resharpenReason").hide();
			$("#resharpenReasonSelect").hide();
		}
	});
};

//个人章
function personalSeal(){
	$(".companyType").hide();  //企业类型隐藏
	$("#companyTypeSelect").hide();
	$(".resharpenReason").hide();  //隐藏重刻原因
	$("#resharpenReasonSelect").hide();
	$(".showProof").hide();  //出示证明隐藏
	$(".proofList").hide();
	$(".selectBecause").hide();
	$(".quantity").show();   //显示商品数量
	$("#number").show();
	$(".StatementList").hide();
};

//加入购物车
$("#addCart").click(function(){
	var informationList = $(".informationList");              //获取印章配置信息名称
	for(i=0;i<informationList.length;i++){
		if(informationList.eq(i).val()==""){
			alert("样式配置信息填写不完整!");
			return;
		}
	}

   if($("#companyTypeSelect").is(":hidden")){        //个人章
      trollerId=saveTrolley();
        mask_layer();
        stopScroll();
	}
	else{      //公章
        if($("#companyTypeSelect").val()=="0"){
		    alert("请选择企业类型!");
	    }
        else{
            var dataTypeId=$(".dataTypeId");
            for(j=0;j<dataTypeId.length;j++){
                if(dataTypeId.eq(j).val()==""){
                    alert("上传资料不全，请到购物车中补全!");
                    window.location.href="/Users/trolley";
                    break;
                }
            }
            trollerId=saveTrolley();
            if (trollerId==00){
                alert("加入购物车失败!");
                return false;
            }
            else{
                mask_layer();
                stopScroll();

            }
        }
	}



});


//立即购买
$("#buyNow").click(function(){
	var informationList = $(".informationList");              //获取印章配置信息名称
	for(i=0;i<informationList.length;i++){
		if(informationList.eq(i).val()==""){
			alert("样式配置信息填写不完整!");
			return;
		}
	}
	var dataTypeId=$(".dataTypeId");
	for(j=0;j<dataTypeId.length;j++){
		if(dataTypeId.eq(j).val()==""){
			alert("上传资料不全，请补全上传资料!");
			return false;
		}
	}
	trollerId=saveTrolley();
	if($("#companyTypeSelect").is(":hidden")){              //判断用户选择的是否是个人章
	    window.location.href="/ShoppingCart/submitOrder?trollerId="+trollerId;
	}
	else{
        if($("#companyTypeSelect").val()=="0"){
		    alert("请选择企业类型!");
        }
        else{
            if(trollerId==0){
            alert("加入购物车失败!");
            return ;
            }
            else{
                    window.location.href="/ShoppingCart/submitOrder?trollerId="+trollerId;
            }
        }
	}
});




function mask_layer()
{
     $("#deleteOneStudentTip").fadeIn(200);
     $("#pictureid").val($(this).attr("id"));
     $("#putplace").val($(this).attr("place"));
     $("#bg").css({
            display: "block", height: $(document).height()
        });
        var $box = $('.box');
            $box.css({
            //设置弹出层距离左边的位置
            left: $("body").width()/2-150+"px",
            //设置弹出层距离上面的位置
            top: $(window).height()/3+"px",
            display: "block"
        });
}

function stopScroll()
{
    $ (window).scroll (function ()
    {
        $ (this).scrollTop (0)
    });

//    $ (function ()
//    {
//        $ (":button").click (function ()
//        {
//            $ (window).unbind ('scroll');
//        })
//    });
}


