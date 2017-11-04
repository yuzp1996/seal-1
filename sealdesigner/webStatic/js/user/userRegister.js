/*
用户注册
王志文
2016/4/14
*/
$(function(){
    imgShow();
//    validateReload();
    $(".userName").val("");
    $(".passWord").val("");
    $(".passWordRepeat").val("");
    $(".Input_verify").val("");
    $(".email").val("");
    $(".button").focus();
    var $inp=$('input');
    $("input[name='toGetCode']").attr("disabled",false);
    $inp.keypress(function(e){
        var key=e.which;
        if(key==13){
          $(".button").click();
        }
    })
});
/*通过邮箱获取验证码*/
function validateReload(){
    var emailVal = $(".email").val();
    var emailOption = "用户注册";
    $.post("/Users/emailgetvaliate",{"email":emailVal,"emailOption":emailOption},function(data){
         if(data=="1"){
         alert("验证已成功发送至您的邮箱，请及时验证！");
         }
         else if (data=="0"){
         alert("邮箱验证码发送失败，请稍后再试！");
         }
    })
}

//倒计时获取验证码
function showtime(t){
    var emailVal = $(".email").val();
//    检查邮箱是否填写及是否正确
    var emailPromptLabel = $(".emailPromptLabel");
    var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(emailVal==""){
        emailPromptLabel.html("请先填写邮箱！").css("visibility","visible");
        return ;
    }
    else if(filter.test(emailVal)==false){
        emailPromptLabel.html("邮箱格式不正确").css("visibility","visible");
        return ;
    }
    validateReload();   //获取邮箱验证码
//    设置不可点击及倒计时
    document.myform.toGetCode.disabled=true;
    for(i=1;i<=t;i++) {
        window.setTimeout("update_p(" + i + ","+t+")", i * 1000);
    }

}
//设置倒计时
function update_p(num,t) {
    if(num == t) {
        document.myform.toGetCode.value =" 重新发送 ";
        document.myform.toGetCode.disabled=false;
    }
    else {
        printnr = t-num;
        document.myform.toGetCode.value = " (" + printnr +")秒后重新获取验证码";
    }
}


/*背景图片和logo*/
function imgShow(){
    $.post("/Users/imgShow",function(data){
        var jsonData = $.parseJSON(data);
        var logoPicUrl="";
        var backgroundPicUrl = "";
        for (i in jsonData){
            if (jsonData[i].picPlace=="1"){
                logoPicUrl = jsonData[i].picUrl;
            }else if (jsonData[i].picPlace=="2"){
                backgroundPicUrl = jsonData[i].picUrl;
            }
        }
        $(".logoImg").attr("src",logoPicUrl);
//        $(".centerArea").css("background-image","url("+backgroundPicUrl+")")#注释了图片
    })
}



$("body").on("focus",".userName",function(){
    $(".userNamePromptLabel").html("2~20，允许中文输入,建议输入真实姓名！").css("visibility","visible");
})
$("body").on("blur",".userName",function(){
    $(".userNamePromptLabel").css("visibility","hidden");
})
$("body").on("focus",".email",function(){
    $(".emailPromptLabel").html("请输入常用邮箱，可用于找回密码").css("visibility","visible");
})
$("body").on("blur",".email",function(){
    $(".emailPromptLabel").css("visibility","hidden");
})
$("body").on("focus",".passWord",function(){
    $(".passWordPromptLabel").html("6~16，密码只能包含_，英文字母，数字！").css("visibility","visible");
})
$("body").on("blur",".passWord",function(){
    $(".passWordPromptLabel").css("visibility","hidden");
})
$("body").on("focus",".passWordRepeat",function(){
    $(".passWordRepeatPromptLabel").html("请填写与上一栏相同的密码，进行确认！").css("visibility","visible");
})
$("body").on("blur",".passWordRepeat",function(){
    $(".passWordRepeatPromptLabel").css("visibility","hidden");
})

/*点击注册按钮*/
$("body").on("click",".submitInfo",function(){
    var userNameVal =  $(".userName").val();
    var emailVal = $(".email").val();
    var emailPromptLabel = $(".emailPromptLabel");
    var passWordVal = $(".passWord").val();
    var passWordRepeatVal = $(".passWordRepeat").val();
    var Input_verifyVal = $(".Input_verify").val();
    var userNamePromptLabel= $(".userNamePromptLabel");
    var passWordPromptLabel=$(".passWordPromptLabel");
    var passWordRepeatPromptLabel = $(".passWordRepeatPromptLabel");
    var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (userNameVal==""){
        userNamePromptLabel.html("用户名不能为空！请重新输入").css("visibility","visible");
        return ;
    }else if (userNameVal.length<2|| userNameVal.length>20){
        userNamePromptLabel.html("用户名长度不合法").css("visibility","visible");
        return ;
    }
    if(emailVal==""){
        emailPromptLabel.html("邮箱地址不能为空").css("visibility","visible");
        return ;
    }
    else if(filter.test(emailVal)==false){
        emailPromptLabel.html("邮箱格式不正确").css("visibility","visible")
        return ;
    }
    if (passWordVal==""){
        passWordPromptLabel.html("密码不能为空！").css("visibility","visible");
        return ;
    }else if (passWordVal.length<6||passWordVal.length>16){
        passWordPromptLabel.html("密码输入长度不合法！").css("visibility","visible");
        return ;
    }
    if (passWordRepeatVal!=passWordVal){
        passWordRepeatPromptLabel.html("两次密码输入不正确！请重新输入").css("visibility","visible");
        return ;
    }
    if (Input_verifyVal==""){
        $(".Input_verifyRepeatPromptLabel").html("验证码不能为空！请重新输入").css("visibility","visible");
        return ;
    }
    passWordVal = hex_sha256(passWordVal)
    $.post("/Users/userRegister",{"userName":userNameVal,"email":emailVal,"passWord":passWordVal,"Input_verify":Input_verifyVal},function(data){
        if (data=="1"){
            alert("注册成功");
            window.location.href="/Users/userLogin?register=True";
        }else if (data=="2"){
            alert("用户已存在，请更换用户名");
            return ;
        }else if(data=="3"){
            $(".Input_verifyRepeatPromptLabel").html("验证码错误！请确认您的验证码！").css("visibility","visible");
            return ;
        }else if (data=="4"){
            alert("该邮箱已注册，请使用未注册的邮箱！");
            return ;
        }else {
            alert("注册失败，请稍候重试！");
            return ;
        }
    })
})
