/*
商品详细信息查看和修改界面

*/
$(function(){
    getAdminName();  //右上角管理员信息
    getBasicData();
    getfont1();
    getFont2();
    getEnterpriseType1();
});
/*获取管理员帐号，显示与右上角*/
function getAdminName(){
    $.post("/Seal/getAdminName",function(data){
        var str=data;
        $("#adminName").append(str);
    })
}

var sealId=window.location.search
sealId=sealId.split("=");
var value=decodeURIComponent(sealId[1]);

function getBasicData(){

    $.post('/Seal/getBasicData',{"sealClassId":value},function(data){
        var jsonData=$.parseJSON(data);
        var str = "";
        /*商品类别基本信息*/
        $(".sealClassName").val(jsonData[0].className);
        $(".sealParentClass").append(jsonData[0].parentName);
        if($(".sealParentClass").text()=="公章"){
            $(".company").show();
        }
        else{
            $(".company").hide();
        }
        var hidefont=jsonData[0].fontId;
        if (jsonData[0].isfont){
            $(".fontShow").val(1);
            $(".fontPage").show();
        }else {
            $(".fontShow").val(0);
            $(".fontPage").hide();
        }
        if (jsonData[0].isformat){

            $(".formatShow").val(1);
            $(".formatPage").show();
            getFormatPicture();
        }else {
            $(".formatShow").val(0);
            $(".formatPage").hide();
        }
        if (jsonData[0].isShow){
            $(".isShow").val(1);
        }else {
            $(".isShow").val(0);
        }
         if($(".sealParentClass").text()=="其他"){
            $("#choosefontid option[value='0']").attr("selected",true);
        }
        else{        $("#choosefontid option[value='"+hidefont+"']").attr("selected",true);
        }
     })
}
function getfont1(){
    $.post("/Seal/getfont1",function(data){
        var jsonData = $.parseJSON(data);
        var str = "";
        var str = "<option value='0'>无默认字体</option>";
        for (var i in jsonData){

            str += "<option value="+jsonData[i].fontid+">"+jsonData[i].fontname+"</option>"
        }
        $("#choosefontid").append(str);
    });
}
$(function() {
        //查看状态下  下拉框只读
        $(".sealClassName").attr("disabled","true");
        $("#select1").attr("readonly","true");
        $("#select3").attr("readonly","true");

        //添加企业类型按钮 单击事件可用
        $("#addCompany").hide();
        $("#saveCompany").hide();
        $("#btnOne").click(function(){
        if($("#btnOne").html() == "修改"){
                $("#btnOne").html("返回");
                $("#select1").removeAttr("readonly","true");
             }else{
                $("#btnOne").html("修改");
                window.location.reload();
                $("#select1").attr("readonly","true");

              }
        $("#addCompany").toggle();
        getEnterpriseType2();

        $("#saveCompany").toggle();
//        $("#select1").removeAttr("readonly","true");
        //双击选项
	    $('#select1').dblclick(function(){ //绑定双击事件
		//获取全部的选项,删除并追加给对方
		$("option:selected",this).appendTo('#select2'); //追加给对方
	    });
	    //双击选项
	    $('#select2').dblclick(function(){
		$("option:selected",this).appendTo('#select1');
	    });
    });
        //修改基本信息
        $("#save").hide();
        $("#btn").click(function(){
            if($("#btn").html() == "修改"){
                $("#btn").html("返回");
                $(".sealClassName").removeAttr("disabled","true");
                $("#choosefontid").removeAttr("disabled","true");
                $("#fontShow").removeAttr("disabled","true");
                $("#formatShow").removeAttr("disabled","true");
                $("#isShow").removeAttr("disabled","true");
             }else{
                $("#btn").html("修改");
                window.location.reload();
                $(".sealClassName").attr("disabled","true");
                $("#choosefontid").attr("disabled","true");
                $("#fontShow").attr("disabled","true");
                $("#formatShow").attr("disabled","true");
                $("#isShow").attr("disabled","true");

              }
            $("#save").toggle();
        });
         //字体修改按钮
         $("#addFont").hide();
         $("#saveFont").hide();
         $("#btnTwo").click(function(){
         if($("#btnTwo").html() == "修改"){
                $("#btnTwo").html("返回");
                $("#select3").removeAttr("readonly","true");
             }else{
                $("#btnTwo").html("修改");
                window.location.reload();
                $("#select3").attr("readonly","true");

              }
         $("#addFont").toggle();
         getFont3();
         $("#saveFont").toggle();

         $('#select3').dblclick(function(){ //绑定双击事件
		//获取全部的选项,删除并追加给对方
		$("option:selected",this).appendTo('#select4'); //追加给对方
	    });

	    $('#select4').dblclick(function(){ //绑定双击事件
		//获取全部的选项,删除并追加给对方
		$("option:selected",this).appendTo('#select3'); //追加给对方
	    });
    });
         $("#saveFormat").hide();
         /*刚进入查看界面默认checkbox不可选*/


         $("#btnThree").click(function(){
         if($("#btnThree").html() == "修改"){
                $("#btnThree").html("返回");
                $(":checkbox").removeAttr ("disabled","disabled");
             }else{
                $("#btnThree").html("修改");
                window.location.reload();
              }
         $("#saveFormat").toggle();
         });
});
//返回按钮  返回上级页面
$("body").on("click","#back",function(){
    window.history.back(-1);
})
function reloadSealClass(){
    window.location.reload();
    $(".sealClassName").attr("disabled","true");
    $("#choosefontid").attr("disabled","true");
    $("#fontShow").attr("disabled","true");
    $("#formatShow").attr("disabled","true");
    $("#isShow").attr("disabled","true");
    }

/*得到已经选择的企业类型下拉列表 */
function getEnterpriseType1(){
    $.post('/Seal/getLeftCompany',{"sealClassId":value},function(data){
        var jsonData=$.parseJSON(data);
        var str = "";
            for (var i in jsonData )
            {
                str += "<option value="+jsonData[i].companyId+">"+jsonData[i].companyName+"</option>"
            }
            $("#select1").append(str);
            });
}
/*得到未选择的企业类型 */
function getEnterpriseType2(){
    $.post("/Seal/getRightCompany",{"sealClassId":value},function(data){
        var jsonData = $.parseJSON(data);
        var str = "";
        for (var i in jsonData){
            str += "<option value="+jsonData[i].companyId+">"+jsonData[i].companyName+"</option>"
        }
        $("#select2").append(str);
    });
}

/*得到已经配置的字体下拉列表 */
function getFont2(){
    $.post('/Seal/getLeftFont',{"sealClassId":value},function(data){
        var jsonData=$.parseJSON(data);
        var str = "";
            for (var i in jsonData )
            {
                str += "<option value="+jsonData[i].fontId+">"+jsonData[i].fontName +"</option>"
            }
            $("#select3").append(str);
            });
}

/*得到未配置的字体下拉列表 */
function getFont3(){
    $.post('/Seal/getRightFont',{"sealClassId":value},function(data){
        var jsonData=$.parseJSON(data);
        var str = "";
            for (var i in jsonData )
            {
                str += "<option value="+jsonData[i].fontId+">"+jsonData[i].fontName +"</option>"
            }
            $("#select4").append(str);
            });
}

/*获取所有可选择板式 已选择的版式打钩   */
function getFormatPicture(){
    $.post("/Seal/getFormatPicture",function(data){
        var jsonData =$.parseJSON (data);
        var str="";
        for (var i in jsonData ){
            str+="<div class='location'><div class='stylePage'><p>板式</p></div><div class='styleUrl'><img src="+jsonData[i].pictureUrl+" /><input name='checkbox' type='checkbox' style='margin-left:96px;margin-top:-5px'disabled='disabled' value="+jsonData[i].formatId+" /></div></div>"
        }
         $("#picturePage").empty().append(str);
         $.post("/Seal/getFormatPicture1",{"sealClassId":value},function(data1){
         var jsonData1 =$.parseJSON(data1);
         var str0="";
         for(var i in jsonData1){
            checkedFormat = jsonData1[i].formatId
            $("input[value='"+checkedFormat+"']").attr("checked","checked");
         }
    });
    });


}

/*点击修改按钮时  将数据反馈到后台*/
//基本信息
$("body").on("click","#save",function(){
    var jsonStr="";
    var sealClassName=$("#sealClassName").val();
    var sealParentClass=$(".sealParentClass").text();
    var choosefontid = $("#choosefontid").find("option:selected").val();
    var fontShow=$("#fontShow").find("option:selected").val();
    var formatShow=$("#formatShow").find("option:selected").val();
    var isShow=$("#isShow").find("option:selected").val();
    if (sealClassName==""){
        alert("请输入商品类别名称");
        return ;
    }
   if (sealParentClass=="其他"){
     if(formatShow==1){
           alert("该类别商品无板式配置");
          return;
        }
      if(fontShow==1){
        alert("该类别商品无字体配置");
        return;
      }
      if(choosefontid!=0){
        alert("该类别商品无默认字体");
        return;
      }
    }
    else{
        if(choosefontid==0){
            alert("请设置默认字体");
            return;
        }
        if(formatShow==0){
            alert("请启用板式配置");
            return;
        }
    }
    /*修改时将配置字体状态改为配置状态*/

    jsonStr =$.extend({},jsonStr ,{
    "sealClassId":value,
    "sealClassName":sealClassName,
    "choosefontid":choosefontid,
    "fontShow":fontShow,
    "formatShow":formatShow,
    "isShow":isShow
    });//字符串拼接
    $.post("/Seal/saveBasicData",jsonStr,function(data){////把声明id post给后台查找这个id下的所有附件信息
    if (data==1)
    {alert("修改成功");}
    else if(data==0)
    {alert("修改失败");}
    else if(data==2)
    {alert("该商品类型已存在");}
    reloadSealClass();

    });

});


$("body").on("click","#saveCompany",function(){
    var jsonStr="";
    var str1=$("#str1").val();                                                                            //版式字符串
        $("#select1 option").each(function(){
            str1=str1+","+($(this).val());
        });

        if(str1==""){
        alert("请至少选择一项");
        return;
        }
      jsonStr =$.extend({},jsonStr ,{
      "str1":str1,
      "sealClassId":value
      });
      $.post("/Seal/saveCompany",jsonStr,function(data){
      if (data==1)
        {alert("修改成功");}
      else if(data==0)
        {alert("修改失败");}
        reloadSealClass();
      });
});

$("body").on("click","#saveFont",function(){
    var jsonStr="";
    var str2=$("#str2").val();                                                                            //板式字符串
        $("#select3 option").each(function(){
            str2=str2+","+($(this).val());
        });
         if(str2==""){
        alert("请至少选择一项");
        return;
        }
      jsonStr =$.extend({},jsonStr ,{
      "str2":str2,
      "sealClassId":value
      });
      $.post("/Seal/saveFont",jsonStr,function(data){
      if (data==1)
        {alert("修改成功");}
      else if(data==0)
        {alert("修改失败");}
        reloadSealClass();
      });
});

$("body").on("click","#saveFormat",function(){
    var jsonStr="";
    var str3=$("#str3").val();                                                                             //版式字符串
       $("input:checkbox[name='checkbox']:checked").each(function() {
			str3 =str3+","+($(this).val());
		});
            if(str3==""){
                alert("请配置板式");
            return;
        }
      jsonStr =$.extend({},jsonStr ,{
      "str3":str3,
      "sealClassId":value
      });
      $.post("/Seal/saveFormat",jsonStr,function(data){
      if (data==1)
        {alert("修改成功");}
      else if(data==0)
        {alert("修改失败");}
        reloadSealClass();
      });
});


