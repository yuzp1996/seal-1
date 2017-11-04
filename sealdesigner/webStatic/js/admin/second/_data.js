$(function(){
    getAdminName();            //右上角管理员信息
    chapterList();
    materialList();
//    checkBoxColorList()
    colorListCheckBox()

    if ($("#action").val()=="look"){
        look();
        return;
        return;
    }
    else if($("#action").val()=="change"){
        $.ajaxSetup({
          async : false
        });
        change();
        return;
    } else {
        classList();
    }
})
  //选择图片动作
  $("body").on("click","#choPic",function(){
      $("#choFile").click()
      $("#choFile").change(function(){
      $("#picText").val($(this).val());
      $("#martiPic").fadeIn(20)
      $("#martiPic").attr("src",getFileUrl("choFile"));
    })
  })

    //点击添加按钮
  $("body").on("click","#commAdd",function(){
    addCommodity();
   })

  $("body").on("click","#yes",function(){
     window.location.href="data";
  })

/*获取管理员帐号，显示与右上角*/
function getAdminName(){
    $.post("/Seal/getAdminName",function(data){
        var str=data;
        $("#adminName").append(str);
    })
}
/* 获取商品父类下拉列表*/
function chapterList(){
    var str ="<option value='0'selected='selected'>请选择</option>";
    $.post("/Seal/getChapter",function(data){
        var jsonData = $.parseJSON(data);
        for(var i in jsonData){
            str+="<option value='"+jsonData[i].id+"'>"+jsonData[i].name+"</option>";
        }
        $("#commChapter").empty().append(str);
    })
}


//联动改变下拉框的值
function linkAge(){
    var str = "<option value='请选择' selected='selected' >请选择</option>"
    if ($("#commChapter").val()==="0")
        classList();
    else
    $.post("/Seal/getCommodityOne",{"commChapter":$("#commChapter").val()},function(data){
        var jsonData = $.parseJSON(data);
        for(var i in jsonData){
            str+="<option value='"+jsonData[i].id+"'>"+jsonData[i].name+"</option>";
        }
        $("#commClass").empty().append(str);
    })
}


/* 获取商品类型下拉列表*/
function classList(){
    var str = "<option value='chose' selected='selected' >请选择</option>"
    $.post("/Seal/getCommodity",function(data){
        var jsonData = $.parseJSON(data);
        for(var i in jsonData){
            str+="<option value='"+jsonData[i].id+"'>"+jsonData[i].name+"</option>";
        }
        $("#commClass").empty().append(str);
    })
}

/* 获取商品材质下拉列表*/
function materialList(){
    var str = "<option value='0' selected >请选择</option>"
    $.post("getMaterials",function(data){
        var jsonData = $.parseJSON(data);
        for(var i in jsonData){
            str+="<option value='"+jsonData[i].id+"'>"+jsonData[i].name+"</option>";
        }
        $("#commStuff").empty().append(str);
    })
}


/*出现复选框*/
function colorAppear(isChecked)
{
   if (isChecked){
    $("#collocation").fadeIn(0);
    $("#colorCollocation").multiselect();
 }else{
   $("#collocation").fadeOut(0)
  }
}





/* 获取颜色下拉列表*/
function colorListCheckBox(){
    var str = ""
    $.post("/Seal/getColor",function(data){
        var jsonData = $.parseJSON(data);
        for(var i in jsonData){
            str+="<option value='"+jsonData[i].id+"'>"+jsonData[i].name+"</option>";
        }
        stradd = "<option value='007' selected >无</option>"+str
        $("#colorCollocation").empty().append(str);
        $("#commColor").empty().append(stradd);
    })
}

//添加商品
function addCommodity(){


    // 获取编辑器区域完整html代码
    a=$("input[name='materialinfo']").val(editor.$txt.html());

    var isPicture = submit_upload_picture();
    $("#colorAdd").val( $("#colorCollocation").val())

    if ($("#makeColor").get(0).checked) {
        $("#ifChose").val(1)
       if ($("#colorAdd").val()=="")
        {
         alert("请选择可配置颜色")
         return;
        }
    }else{$("#ifChose").val(0)}

    if ($("#commName").val()=="")
    {
       alert("商品名称不可为空")
    }else if ($("#commClass").val()=="chose")
    {
    alert("请选择商品类型")
    }
    else if ($("#commStuff").val()=="chose")
    {
     alert("请选择商品材质")
    }
    else if($("#commPrice").val()==""||!checkPrice()){
        alert("价格输入不规范，请输入只含两位小数的数字！");
    }
    else if($("#commCount").val()==""||!jude()){
        alert("库存输入不规范，请输入正整数！");
    }
    else if (isPicture==1)
    {
        $("#commodity_form").attr("action","commodityAdd");
        $.ajaxSetup({});
        $("#commodity_form").ajaxSubmit
        ({
           resetForm:false,
           dataType:'json',
           success:function(data){
           if(data==1)
             { alert("添加成功")
               window.location.href="data";
             }
           else if(data==11){
           alert("商品名称重复")
           }
           else
               alert("添加失败")
           }
    })
    }
    else
    alert("图片类型必须是.gif,jpeg,jpg,png中的一种");

}


//进入查看页面
function look()
{
$("#yes,#CommStuffText,#2,#commClassText").fadeIn(0)
$("#commCanel,#commAdd,#picText,#choPic,#fenLei,#commStuff,#1,#3,#commClass").fadeOut(0)
$.post("getMaterInfor",{"mateId":$("#mateId").val()},function(data){
    $("#makeColor").attr({ disabled: 'disabled' })
    var jsonData=$.parseJSON(data);
        if (jsonData.isNo==1)
            {

            $("#makeColor").attr("checked",true)
            $("#collocation").fadeIn(0)
            times=jsonData.times
            var colorVal=[];
            for (time=1;time<=times;time++)
            {
                var colorIndex = "color"+time;
                end = jsonData[colorIndex]
                colorVal.push(end)
            }
            var ids = colorVal
            $('#colorCollocation').val(ids);
            }
        $("#colorCollocation").multiselect();
        $("#commName").val(jsonData.materialName);
        $("#CommStuffText").val(jsonData.commStuff);
        $("#commPrice").val(jsonData.materialPrice);
        $("#commCount").val(jsonData.materialRemainder);
        $("#comIntro").val(jsonData.materialIntroduction);
        $("#commClassText").val(jsonData.sealClassName);
        $("#commColor").val(jsonData.commColor);
        $("#materialInfo").val(jsonData.materialInfo);
        //ue.setContent(jsonData.materialInfo);
        editor.$txt.append(jsonData.materialInfo);


        isShow=jsonData.isShow
        if (isShow==false)
           isShow=0;
        else
           isShow=1;
        $("#isUse").find("[value="+isShow+"]").attr("checked","checked");
        isSecommendation=jsonData.isSecommendation
        if (isSecommendation==false)
            isSecommendation=0;
        else
            isSecommendation=1;
        $("#isRecommend").find("[value="+isSecommendation+"]").attr("checked","checked");
        picture=jsonData.picture
        $("#picture").empty().append('<p>示例图片<p><img src='+picture+' style="width:35%;height:35%">')
})
}

//进入修改页面
function change()
{

$("#yes,#changeButton,#3,#deleteButton").fadeIn(0)
$("#commAdd,#yes,#1,#2").fadeOut(0)


$.post("getMaterInfor",{"mateId":$("#mateId").val()},function(data){
    var jsonData=$.parseJSON(data);
        $("#commName").val(jsonData.materialName);
        $("#commPrice").val(jsonData.materialPrice);
        $("#commCount").val(jsonData.materialRemainder);
         setTimeout(function(){
            if (jsonData.isNo==1)
             {
                $("#makeColor").attr("checked",true)
                $("#collocation").fadeIn(0)
                times=jsonData.times
                var colorVal=[];
                for (time=1;time<=times;time++)
                {
                    var colorIndex = "color"+time;
                    end = jsonData[colorIndex]
                    colorVal.push(end)
                }
                var ids = colorVal
                $('#colorCollocation').val(ids);
                $("#colorCollocation").multiselect();

             }
            $("#commChapter").val(jsonData.sealParentClassName);
            $("#commChapter").val(jsonData.sealParentClassName)
            linkAge();
            $("#commClass").val(jsonData.sealClassId)
            $("#commColor").val(jsonData.commColor)
            $('#commStuff').attr('value',jsonData.commStuffId);
            $("#comIntro").val(jsonData.materialIntroduction);
            //ue.setContent(jsonData.materialInfo);
            editor.$txt.append(jsonData.materialInfo);

            },1);
        isShow=jsonData.isShow
        if (isShow==false)
           isShow=0;
        else
           isShow=1;
        $("#isUse").find("[value="+isShow+"]").attr("checked","checked");
        isSecommendation=jsonData.isSecommendation
        if (isSecommendation==false)
            isSecommendation=0;
        else
            isSecommendation=1;
        $("#isRecommend").find("[value="+isSecommendation+"]").attr("checked","checked");
//        $('#commStuff').attr('value',jsonData.commStuffId);
        picture=jsonData.picture
        $("#exPicture").append('<p>原图片<p><img src='+picture+' style="width:35%;height:35%">')


})}


//修改商品
$("body").on("click","#changeButton",function(){

    a=$("input[name='materialinfo']").val(editor.$txt.html());
    if ($("#makeColor").get(0).checked) {
        $("#ifChose").val(1)
    }else{$("#ifChose").val(0)}

    if($("#commPrice").val()==""||!checkPrice()){
        alert("价格输入不规范，请输入只含两位小数的数字！");
    }
    else if($("#commCount").val()==""||!jude()){
        alert("库存输入不规范，请输入正整数！");
    }
    else if(/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test($('#choFile').val())|$('#choFile').val()==""){
    $("#colorAdd").val( $("#colorCollocation").val())
    if(/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test($('#choFile').val())|$('#choFile').val()=="")
     {
        pictureUrl = $("#pictureUrl").val()
        $("#commodity_form").attr("action","materialChange");
        $.ajaxSetup({});
        $("#commodity_form").ajaxSubmit({
           resetForm:false,
           dataType:'json',
           success:function(data){
               if(data==2){
                    alert("修改成功");
                    window.location.href="data";
               }
               else if(data==3){
                    $.post("deleteOneMaterialPicture",{"pictureUrl":pictureUrl},function(){
                    });
                    alert("修改成功");
                    window.location.href="data";
               }
               else if(data==111)
                    alert("商品名称重复")
               else
                   {alert("修改失败");
//                    window.location.href="data";
                    }


           }
        });
     }
     else{alert("图片类型必须是.gif,jpeg,jpg,png中的一种");}
     }
})

$("body").on("click","#deleteButton",function(){
    if(confirm("是否确认删除？")){
        $("#commodity_form").attr("action","deleteMaterials")
        $("#commodity_form").ajaxSubmit({
            resetForm:false,
            dataType:'json',
            success:function(data){
                if (data==0){
                    alert("删除成功")
                    window.location.href="data";
                }
                else{
                    alert("此商品不可删除")
                }
            }
        })
    }
})




/*判断价格输入是否为数字*/
function checkPrice(){
    var price=document.getElementById("commPrice").value;
    var isprice=/^[0-9]+([.][0-9]{2})?$/;
    if(isprice.test(price)){
        return true;
    }
}


/*判断库存输入是否为正整数*/
function jude(){
    var count=$("#commCount");
    for(var i=0;i<count.length;i++){
        var a =$(count[i]).val();
        if (a.search("^-?\\d+$")!=0&&a!=""){
            $(count[i]).focus();
            return false;
        }
    }
    return true;
}

//判断图片类型
function submit_upload_picture()
{
	var file = $('#choFile').val();
	if(/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(file)){
	    return 1;
	}else{
	    return 0;
	 }
}














