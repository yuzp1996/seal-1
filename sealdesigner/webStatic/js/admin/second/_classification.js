$(function(){
    getAdminName();  //右上角管理员信息
    getSeal_ParentMeterialClass();
    getEnterpriseType();
    getfont1();
    $("#chooseFont").attr("checked",false);
    $("#className").val("");
    $("#chooseStyle").attr("checked",false);



//    check();
});


/*获取管理员帐号，显示与右上角*/
function getAdminName(){
    $.post("/Seal/getAdminName",function(data){
        var str=data;
        $("#adminName").append(str);
    })
}

function getSeal_ParentMeterialClass(){
    $.post("/Seal/getSeal_ParentMeterialClass",function(data){

        var jsonData = $.parseJSON(data);
        var str = "";
        for (var i in jsonData){
            str += "<option value="+jsonData[i].parentClassId+">"+jsonData[i].parentName+"</option>"
        }
        $(".sealClass").append(str);
    });
}


function getEnterpriseType(){
    $.post("/Seal/getEnterpriseType",function(data){

        var jsonData = $.parseJSON(data);
        var str = "";
        for (var i in jsonData){
            str += "<option value="+jsonData[i].companyId+">"+jsonData[i].companyName+"</option>"
        }
        $(".lockClass").append(str);
        $('.lockClass').multiselect();
    });
}


function getfont1(){
    $.post("/Seal/getfont1",function(data){

        var jsonData = $.parseJSON(data);
        var str = "";
        for (var i in jsonData){
            str += "<option value="+jsonData[i].fontid+">"+jsonData[i].fontname+"</option>"
        }
        $(".defaultFont").append(str);
    });
}



function configFont(){
//     $.ajaxSetup({
//            async:true
//     });
//    var jsonStr="";
//    jsonStr = $.extend({},jsonStr,{"defaultFontId":$(".defaultFont").find("option:selected").val()});

//    if (defaultFontId!=""){
//        jsonStr = $.extend({},jsonStr,{"defaultFontId":$(".defaultFont").find("option:selected").val()});  //字符串拼接
//    }

    $.post("/Seal/getfont2",function(data){
        var jsonData = $.parseJSON(data);
        var str = "";
        for (var i in jsonData){
            str += "<option value="+jsonData[i].fontid+">"+jsonData[i].fontname+"</option>"
        }
        $(".configfont").empty().append(str);
        $(".configfont").multiselect();
    });
}

//点击“用户可自行配置字体”
$("body").on("change","#chooseFont",function(){
    if ($("#chooseFont").prop("checked"))
    {
        configFont();
        $("#isconfigfont").show();
//        $("#configfont").empty();
//        configFont();

//        $("#defaultFont").attr("disabled","disabled");

    }
    else
    {
        $("#isconfigfont").hide();
//        $("#defaultFont").removeAttr("disabled");


    }
});
//改变默认字体获取配置字体
//$("body").on("change","#defaultFont",function(){
//    configFont();
//});


//选择公章才会出现配置公司类型
$("body").on("change","#sealClass",function(){
    if($(this).val()==2)
    {
        $("#EnterpriseType").show();
    }
    else
    {
        $("#EnterpriseType").hide();
    }
});
$("body").on("change","#sealClass",function(){
    if($(this).val()==3)
    {
        $("#format1").hide();
        $("#defaultf").hide();
    }
    else
    {
        $("#format1").show();
        $("#defaultf").show();

    }
});
$("body").on("change","#chooseStyle",function(){
if ($("#chooseStyle").prop("checked"))
    {
        $("#styleCheck").show();
        getFormatPicture();
    }
    else
    {
        $("#styleCheck").hide();
    }
})





function getFormatPicture(){
    $.post("/Seal/getFormatPicture",function(data){
        var jsonData =$.parseJSON (data);
        var str="";
        for (var i in jsonData ){
            str+="<div class='location'><div class='stylePage'><p>板式</p></div><div class='styleUrl'><img src="+jsonData[i].pictureUrl+" /><input name='checkbox' type='checkbox' style='margin-left:140px;margin-top:-5px' value="+jsonData[i].formatId+" /></div></div>"
        }
         $("#picturePage").empty().append(str);
    });
}





$("body").on("click","#buttonAdd",function(){
    var jsonStr = "";
    var classname = $("#className").val();                                                  //商品类别名称
    var parentclassclass = $(".sealClass").find("option:selected").val();               //商品类别父类
    var defaultFont = $(".defaultFont").find("option:selected").val();                      //默认字体
    if(parentclassclass==3){
    defaultFont=0;
    }
    var isconfigfont = $("#chooseFont").val();                                              //自行配置字体value
    var radioVal =$("input[name='isShowRadio']:checked").val()                          //是否启用
    var isformat = $("#chooseStyle").val();                                                 //是否配置版式
    var str1 = $("#str1").val();                                                            //企业类型字符串
    var str2 = $("#str2").val();                                                            //配置字体字符串
    var str3="";                                                                            //版式字符串
    if (parentclassclass==2){
        $("#lockClass :selected").each(function(){
            str1=str1+","+($(this).val());

        });
    }
    else{
    str1=0;
    }
    if($("#chooseFont").prop("checked"))
    {
        isconfigfont=1;
        $("#configfont").each(function(){
        str2=str2+","+($(this).val());                                                        //用户配置字体库
        });
    }
    else
    {
        isconfigfont=0;
        str2=0;
    }
    if ($("#chooseStyle").prop("checked"))
    {
       isformat=1;
       $("input:checkbox[name='checkbox']:checked").each(function() {
			str3 =str3+","+($(this).val());
		});

    }
    else
    {
        isformat=0;
        str3=0;
    }
    if (classname==""){
    alert("请输入商品类别名称");
        return ;
    }
    if(parentclassclass==2){
        if(str1==""){
        alert("请选择企业类型");
        return;}
    }
    if(isconfigfont==1){
        if(str2==",null"){
        alert("请选择配置字体");
        return;
        }
    }
    if($("#sealClass").val()!=3){
        if(isformat==0){
            alert("请点击选择版式");
        return;
        }
        else{
            if(str3==""){
                alert("请配置版式");
            return;
        }}
    }


    jsonStr = $.extend({},jsonStr,{
    "classname":classname,
    "parentclassclass":parentclassclass,
    "str1":str1,
    "defaultFont":defaultFont,
    "isconfigfont":isconfigfont,
    "isformat":isformat,
    "radioVal":radioVal,
    "str2":str2,
    "str3":str3
    });  //字符串拼接
    $.post("/Seal/addSealClass",jsonStr,function(data){  //把声明id post给后台查找这个id下的所有附件信息
    if (data==1)
    {alert("添加成功");}
    else if(data==0)
    {alert("添加失败");}
    else if(data==2)
    {alert("该商品类型已存在");}
    $("#cancel").click();
    });

});












//function check(){
//$("#chooseFont").change(function(){
//        alert(1);
//       if($(this).prop("checked"))
//       alert(2);
//        $('#defaultFont').attr("checked",true);
//       else
//        $('#defaultFont').removeAttr("disabled");
//});
//)
//}


//else{
//$('#defaultFont').attr("disabled");
//}
//}
//function checked(){
//if(document.getElementById("chooseFont").checked=false){
//    alert(1);
//   $('#defaultFont').Attr("disabled");
//}
//}
//$('#defaultFont').removeAttr("disabled");
//$(document).ready(function() {
//        $('#lockClass').multiselect({
//            nonSelectedText: 'Check an option!'
//        });
//    });