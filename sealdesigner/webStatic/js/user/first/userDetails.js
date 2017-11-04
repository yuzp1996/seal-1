
$(function(){
    getProvince();
//    alert($.cookie("userId")); //获取缓存中的用户id
//        $.ajaxSetup({
//          async : false     //ajax同步，默认为false异步
//        });
    getUserInformation();
})

//修改个人资料
$("body").on("click","input[name='userDetailSave']",function(){
    if($("input[name='userDetailSave']").val()=="修改个人资料"){
        $("input[type='text']").removeAttr("disabled","disabled");
        $(".city").removeAttr("disabled","disabled");
        $(".changePwd").show();
        $(".warn").show();
        $(".personPictureChange").show();
        $("input[name='userReturn']").show();
        $("input[name='userDetailSave']").val("保存修改");
    }else{
        var name = $(".userName").val();
        if(name.length>20||name.length<1){
            alert("请输入1~20位以内真实姓名！");
            return;
        }
		var ispicture=submit_upload_picture();
        if(ispicture==0){
            alert("图片格式不符合要求，请重新上传！")
            return;
        }
        if($("#area").val()==0){
            alert("请选择地区！");
            return;
        }
        if($(".userPhone").val()==""){
            alert("请填入联系电话！");
            return ;
        }else{
            var mobile = $(".userPhone").val();
            if(mobile.length!=11)
            {
                alert('请输入有效的手机号码！');
                document.form1.mobile.focus();
                return;
            }
            var myreg = /^0?1((3|8)[0-9]|5[0-35-9]|4[57])\d{8}$/;   //130--139。180--189。150-159(154除外)
            if(!myreg.test(mobile))
            {
                alert('请输入有效的手机号码！');
                document.form1.mobile.focus();
                return;
            }
        }
        if($(".email").val()==""){
            alert("请填入邮箱！");
            return ;
        }else{
            var email = $(".email").val(); //获取邮箱地址
            //判断邮箱格式是否正确
            if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)) {
                alert("邮箱格式错误,请重新输入!");
                document.getElementById("email").focus(); //让邮箱文本框获得焦点
                return;
            }
        }
        if($("#changeId").attr("checked")=="checked"){
            if($(".password").val()==""){
                alert("请输入原始密码！");
                return;
            }
            if($(".pwdChange1").val()==""){
                alert(" 请输入新密码！");
                return;
            }
            if($(".pwdChange2").val()==""){
                alert("请确认密码！");
                return;
            }
            var a = $(".pwdChange1").val();
            var b = $(".pwdChange2").val()
            if((a.length>20||a.length<6)||(b.length>20||b.length<6)){
                alert("密码长度不符合要求，请重新输入！");
                return;
            }else{
                if($(".pwdChange1").val()!=$(".pwdChange2").val()){
                alert("两次输入的密码不一致，请重新输入！")
                return;
                }
            }
            $(".password").attr("name","password");
            $(".pwdChange1").attr("name","pwdChange1")
        }
		$("#user_form").attr("action","userSave");
		$.ajaxSetup({
	    });
        $("#user_form").ajaxSubmit
        ({
            resetForm:false,
            dataType:'json',
            success:function(data){
                if (data==1){
                   alert("修改成功!")
                   location.href="userDetails";
                }else if(data==2){
                   alert("输入原密码不正确!")
                }else
                    alert("修改失败！")
                }
        });
    }
})


//放弃修改个人资料
$("body").on("click","input[name='userReturn']",function(){
    if (confirm("确认放弃修改?")){
        getUserInformation();
    }
})
//获取用户所有信息
function getUserInformation(){
    $.post("/Users/getUserInformation",{"userId":$.cookie("userId")},function(data){
        var jsonData = $.parseJSON(data);
        var str= "";
        for(var i in jsonData){
            if(jsonData[i].userSex){
                $("input[name='sex']:first").attr('checked', 'true');
            }else{
                $("input[name='sex']:last").attr('checked', 'true');
            }
            $(".userName").val(jsonData[i].userName);
            $(".userPhone").val(jsonData[i].userPhone);
            $(".email").val(jsonData[i].userEmail);
            $(".userRegisterTime").empty().append(""+jsonData[i].registerTime+"");  //字符串形式传值
            if (jsonData[i].userPic!=null){
                $(".imgArea").attr("src",jsonData[i].userPic);    //获取用户图片
            }else{
                $(".imgArea").attr("src","/webStatic/img/user/88888.png");  //默认图片
            }
            $("#province").val(jsonData[i].provinceId);
            provinceChange(jsonData[i].areaId);  //直接把地区的id传给函数
            $("input[name='userReturn']").hide();
            $(".changePwd").hide();
            $("#changeId").attr("checked",false);
            $(".pwdChange").hide();
            $("input[name='userDetailSave']").val("修改个人资料");
            $(".warn").hide();
            $(".personPictureChange").hide();
            $("input[type='text']").attr("disabled","disabled");
            $(".city").attr("disabled","disabled");
        }
    });
}

//修改密码复选框
$(function(){
    $("#changeId").attr("checked",false);
    $(".pwdChange").hide();

})
$("body").on("click","#changeId",function(){
    if($("#changeId").attr("checked")){
        $(".pwdChange").show();
    }else{
        $(".pwdChange").hide();
    }
})


//判断图片类型
function submit_upload_picture()
{
	var file = $('#ImgFile').val();
	if(/.(gif|jpg|jpeg|png|gif|jpg|GIF|JPG|JPEG|PNG|GIF)$/.test(file)|file==""){
	    return 1;
	}else{
	    return 0;
	 }
}

//用户头像上传
$(function(){
		$(".show").click(function(){
			$(".ImgFile").click();
		})
		$(".ImgFile").change(function(){
			$(".ImgName").val($(this).val());
			$(".imgArea").attr("src",getFileUrl("ImgFile"));
		})
	})

//获取input[file]图片的url Important
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

//获取省份下拉列表
function getProvince(){
    $.post("/Users/getProvince",function(data){
        var jsonData = $.parseJSON(data);
        var str = "<option value='0'>请选择省份</option>";
        for (var i in jsonData){
            str += "<option value="+jsonData[i].provinceId+">"+jsonData[i].provinceName+"</option>"
        }
        $("#province").append(str);
    });
}

//(省份）下拉列表值为零时，地区列表为空
$("body").on("change", "#province", function(){
    provinceChange(0);
})

/* 所属地区：（省份）下拉列表值改变时，相应加载地区下拉列表 */
function provinceChange(areaId){
    var str="<option value='0'>请选择地区</option>";
    if ($("#province").val()==0){   //没有选择省份则将界面按照排序条件排序
        $("#area").empty().append(str);   //将地区下拉列表置空
    }else{
        $.post("/Users/selectArea",{ "provinceId":$("#province").val()},function(data){
            //查询结果有多个地区：一对多
            var jsonData=$.parseJSON(data);
            for(var i in jsonData){
                str+="<option value="+jsonData[i].areaId+">"+jsonData[i].areaName+"</option>";
            }
            $("#area").empty().append(str);
            $("#area").val(areaId)
        })
    }
}