$(function(){
    $.cookie("page",1)
	$(".sbPic").click(function(){
    $("#picfile").click()
    })
    $("#picfile").change(function(){
    $(".ImgName").val($(this).val());
    $("#chosePicture").fadeIn(200);
    $(".imgArea").attr("src",getFileUrl("picfile"));
    })
    $.cookie("page",1);       //默认当前页数为1
    getAdminName();            //右上角管理员信息
    getPictures();         //加载图片列表
    if($("#actionid").val()=="look"){
           lookFunction();
        }
    else if ($("#actionid").val()=="change"){
        changeFunction();
        }
    else
        $("#changebut").hide();
})

/* 分 页 */
$("body").on("click",".pageNum",function(){
    if ( $.cookie("page")!=$(this).html()){  //判断点击的不是当前页
            $.cookie("page",$(this).html());
    }
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    getPictures();
})
/*上一页*/
$("body").on("click",".pageUp",function(){
    var num = $.cookie("page");
    $.cookie("page",num-1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    getPictures();
})

/*下一页*/
$("body").on("click",".pageDown",function(){
    var num = parseInt($.cookie("page"));
    $.cookie("page",num+1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    getPictures();
})


//保存图片
 $("body").on("click","#buttonsave",function(){
	var ispicture=submit_upload_picture();
	if(ispicture==1)
	{
		$("#picture_form").attr("action","addOnePicture");
		$.ajaxSetup({
	    });
        $("#picture_form").ajaxSubmit
        ({
            resetForm:false,
            dataType:'json',
           success:function(data){
             if (data==1)alert("添加成功")
             else alert("添加失败")
             location.href="pictureShow";
             }
        });
     }
     else
     {alert("图片类型必须是.gif,jpeg,jpg,png中的一种");}
})
//修改图片
$("body").on("click","#changebut",function(){
    if(/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test($('#picfile').val())|$('#picfile').val()=="")
     {
         id = $("#pictureid").val()
         URL = $("#picUrl").val()
         $("#picture_form").attr("action","changeOnepicture");
         $.ajaxSetup({});
         $("#picture_form").ajaxSubmit({
             resetForm:false,
             dataType:'json',
             success:function(data){
             if(data==1)
               {alert("修改成功");
                $.post("delefilepic",{"URL":URL},function(){
                })}
             else
             if (data==2)
                 {alert("修改成功");}
             else
                alert("修改失败");
                location.href="pictureShow";
             }

         });
     }
     else{alert("图片类型必须是.gif,jpeg,jpg,png中的一种");}
})


//判断图片类型
function submit_upload_picture()
{
	var file = $('#picfile').val();
	if(/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(file)){
	    return 1;
	}else{
	    return 0;
	 }
}
//返回键
 $("#back").click(function(){
    location.href="pictureShow";})

//获取展示图片列表 分页数据
function getPictures(jsonStr){
    var jsonStr = "";
    jsonStr = $.extend({},{"page":$.cookie("page")});
    $.post("/Seal/picinfos",jsonStr,function(data){
        var str = "";
        var picName="";
        var jsonData=$.parseJSON(data);
        for (var i in jsonData){
            if (jsonData[i].picPlace==1)
               { picName = "网站logo"}
            if (jsonData[i].picPlace==2)
				   {picName = "注册和登录背景图"}
				 if (jsonData[i].picPlace==3)
				   {picName = "首页轮播图片"}
            str += "<tr><td>"+picName+"</td><td>"+jsonData[i].picName+"</td><td>"+jsonData[i].linkUrl+"</td><td>"+jsonData[i].createTime+"</td><td><a href='dingxiang?way=look&id="+jsonData[i].picId+"'>详情 </a><a href='dingxiang?way=change&id="+jsonData[i].picId+"&URL="+jsonData[i].picUrl+"'>修改 </a><a id='"+jsonData[i].picId+"'place='"+jsonData[i].picPlace+"'class='deletepic'>删除</a></td></tr>"
        }
        $("#pictureList").empty().append(str);
        $.cookie("pageCount",jsonData[0].num);
        if (jsonData[0].num!=0){
            $(".page").empty().append(pageJs(jsonData[0].num,10));    //加载分页列表
        }

    })
}
//跳转详细页面函数
function look(){
    window.location.href="_pictureshow.html";
}

/*获取管理员帐号，显示与右上角*/
function getAdminName(){
    $.post("/Seal/getAdminName",function(data){
        var str=data;
        $("#adminName").append(str);
    })
}


//删除图片
$("body").on("click",".deletepic",function(){
     $("#deleteOneStudentTip").fadeIn(200);
     $("#pictureid").val($(this).attr("id"));
     $("#putplace").val($(this).attr("place"));
     $("#bg").css({
            display: "block", height: $("#content").height()
        });
        var $box = $('.box');
        $box.css({
            //设置弹出层距离左边的位置
            left: ($("body").width() - $box.width()) / 2 + 120 + "px",
            //设置弹出层距离上面的位置
            top: ($(window).height() - $box.height()) / 4 + $(window).scrollTop() + "px",
            display: "block"
        });
})
//删除图片
$("body").on("click",".sure",function(){
 $.ajaxSetup({
            async:true
          });
$.post("deleteOnePicture",{"pictureid":$("#pictureid").val(),"putPlace":$("#putplace").val()},function(data){
                $("#deleteOneStudentTip").fadeOut(100);
                if(data==1){alert("删除成功");}
                else{alert("删除失败");}
              location.reload();
            });
   })
//取消删除
  $(".cancel").click(function(){
      $("#deleteOneStudentTip").fadeOut(100);
      $("#bg,.box").css("display", "none");
  });
function lookFunction(){

    $("#examplePicture").fadeIn(200);
    $("#choosePicture").hide();
    $("#buttonsave").hide();
    $("#changebut").hide();
    $("#choose").hide();
    $("#lo").fadeIn(20);
    $("#add").fadeOut(20);
    $("#putPla").fadeIn(20)
    $("#PutPlace").hide()
    $.ajaxSetup({async:false});
    $.post("getOnePictureInfo",{"pictureid":$("#pictureid").val()},function(data){
        var jsonData=$.parseJSON(data);
        var picId = jsonData.pictureid;
        $("#PutPlace").val(jsonData.picPlace);
        if($("#PutPlace").val()==1)
             place="网站logo"
        else if ($("#PutPlace").val()==2)
             place="注册和登录背景图"
        else
             place="首页轮播图片"
        $("#putPla").val(place)
        $("#PictureName").val(jsonData.picName);
        $("#PicLink").val(jsonData.PicLink)
        imgSrc=(jsonData.picUrl)
        $("#examplePicture").empty().append('<p style="font-size: 15px;margin:8%">示例图片：</p><img src='+imgSrc+'>');
    })

}
function changeFunction(){

    $("#buttonsave").hide();
    $("#name").hide();
    $("#name1").fadeIn(10);
    $("#chang").fadeIn(20);
    $("#examplePicture").fadeIn(200);
    $("#add").fadeOut(20);
    $("#putPla").fadeIn(20)
    $("#PutPlace").hide()
    $("#putPla").attr({ readonly: 'true' })
    $.ajaxSetup({async:false});
    $.post("getOnePictureInfo",{"pictureid":$("#pictureid").val()},function(data){
        var jsonData=$.parseJSON(data);
        var picId = jsonData.pictureid;
        $("#PutPlace").val(jsonData.picPlace);
        if($("#PutPlace").val()==1)
            place="网站logo"
        else if ($("#PutPlace").val()==2)
            place="注册和登录背景图"
        else
            place="首页轮播图片"
        $("#putPla").val(place)
        $("#PicLink").val(jsonData.PicLink)
        $("#PictureName").val(jsonData.picName);
        imgSrc=(jsonData.picUrl)
        $("#examplePicture").empty().append('<p style="font-size: 15px;margin:8%">示例图片：</p><img src='+imgSrc+'>');})
    }


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