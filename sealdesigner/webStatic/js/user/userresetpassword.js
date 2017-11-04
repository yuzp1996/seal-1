/*
前台登录界面js
王志文
2016/4/19
*/
$(function(){
    $("#account").show();
    $("#email").hide();
    $("#password").hide();
    $("#header").remove();

    imgShow();
    validateReload();
    $(".accountGet").val("");
    $(".passWord").val("");
    $(".passWordRepeat").val("");
    $(".Input_verify").val("");
    $(".button").focus();
    var $inp=$('input');
    $inp.keypress(function(e){
        var key=e.which;
        if(key==13){
          $(".button").click();
        }
    });
    $.ajax({
        async : false,
    });

});

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
    })
}


/*************************第一步****************************/
$("body").on("focus",".accountGet",function(){
    $(".userNamePromptLabel").html("2~20，允许中文输入,建议输入真实姓名！").css("visibility","visible");
})
$("body").on("blur",".accountGet",function(){
    $(".userNamePromptLabel").css("visibility","hidden");
})

//验证码
$("body").on("focus",".Input_verify",function(){
    $(".Input_verifyRepeatPromptLabel").html("验证码不区分大小写").css("display","visible");
})
$("body").on("blur",".Input_verify",function(){
    $(".Input_verifyRepeatPromptLabel").css("visibility","hidden");
})

/*第一步刷新验证码*/
function validateReload(){
    $.post("/ShoppingCart/validate",function(data){
        $("#indexcode").empty().append("<img id='imValidate'  src='data: image/gif;base64,"+data+"'/>");
    });
}
/*点击刷新验证码*/
$("body").on("click","#indexcode",function(){
    validateReload();
})

/****************************第二步****************************/
//$("body").on("focus",".valiate",function(){
//    $(".valiatePromptLabel").html("验证码不区分大小写").css("display","visible");
//})
//$("body").on("blur",".valiate",function(){
//    $(".valiatePromptLabel").hide();
//})

/*通过邮箱获取验证码*/
function emailValidateReload(){
    var username = $(".accountGet").val();
    $.post("/Users/emailgetvaliate",{"username":username},function(data){
         if(data=="1"){
            alert("验证已成功发送至您的邮箱，请及时验证！");
         }
         else if (data=="0"){
             alert("邮箱验证码发送失败，请稍后再试！");
             window.location.reload();
         }
    })
}

//倒计时获取验证码
function showtime(t){
    var emailVal = $(".email").val();
    emailValidateReload();
     //设置不可点击及倒计时
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

/*****************************第三步************************************/
$("body").on("focus",".password",function(){
    $(".passWordPromptLabel").html("6~16，密码只能包含_，英文字母，数字！").css("visibility","visible");
})
$("body").on("blur",".password",function(){
    $(".passWordPromptLabel").css("visibility","hidden");
})
$("body").on("focus",".repeatPassword",function(){
    $(".passWordRepeatPromptLabel").html("请填写与上一栏相同的密码，进行确认！").css("visibility","visible");
})
$("body").on("blur",".repeatPassword",function(){
    $(".passWordRepeatPromptLabel").css("visibility","hidden");
})

/*************************找回密码设置1****************************/
$("body").on("click","#firstStep",function(){
    var userNameVal =  $(".accountGet").val();
    var Input_verifyVal = $(".Input_verify").val();   /*验证码*/
    var userNamePromptLabel= $(".userNamePromptLabel");
    var passWordPromptLabel=$(".passWordPromptLabel");
    if (userNameVal==""){
        userNamePromptLabel.html("用户名不能为空！请重新输入").css("display","block");
        validateReload();
        return ;
    }
    if (Input_verifyVal==""){
        $(".Input_verifyRepeatPromptLabel").html("验证码不能为空！请重新输入").css("display","block");
        validateReload();
        return ;
    }
    $.post("/Users/userResetPassword",{"userName":userNameVal,"Input_verify":Input_verifyVal},function(data){
        if(data=="0"){
            $(".Input_verifyRepeatPromptLabel").html("验证码错误！请重新输入").css("display","block");
            validateReload();
            return ;
        }else if (data=="2"){
            userNamePromptLabel.html("用户名不存在！请重新输入").css("display","block");
            validateReload();
            return ;
        }else if (data=="3"){
            alert("操作失败,请稍后重试!");
        	validateReload();
            return ;
        }else {
            $("#account").hide();
            $("#email").show();
            $(".emailGet").val(data);
            $("#password").hide();
        }
    })
})


/***********************************************************************************************/
/*点击按钮发送验证码*/
//$("body").on("click","#email_verify",function(){
//    var userNameVal =  $(".accountGet").val();
//    var email = $(".emailGet").val();
//    if (email==""){
//        userNamePromptLabel.html("邮箱不能为空！请重新输入").css("display","block");
//        return ;
//    }
//    $.post("/Users/emailgetvaliate",{"username":userNameVal,"email":email},function(data){
//     if(data=="1"){
//        alert("验证码已成功发送至您的邮箱，请及时查看！");
//     }
//     else if (data=="0"){
//        alert("验证码发送失败，请稍后再试！");
//     }
//    })
//})

/*************************找回密码设置2 ****************************/
$("body").on("click","#secondStep",function(){
    var valiate = $("#valiate").val();   /*验证码*/
    var userNameVal =  $(".accountGet").val();
    if (valiate==""){
        $(".valiatePromptLabel").html("验证码不能为空！请重新输入").css("display","block");
        return ;
    }
    $.post("/Users/userResetPassword2",{"username":userNameVal,"valiate":valiate},function(data){
        if(data=="1"){
            $("#account").hide();
            $("#email").hide();
            $("#password").show();
            $.post("/Users/securityAccess",{"username":userNameVal},function(data){
                if(data!=""){
                    $(".securityAccess").val(data);
                }
                else{
                    userNamePromptLabel.html("验证码错误，请重新输入").css("visibility","visible");
                }
            })
        }else if(data==0){
            alert("验证码错误，请重新输入！");
            return;
        }
        else {
        	alert("操作失败,请稍后重试!");
            return ;
        }
    })
})

/*************************找回密码设置3 ****************************/
$("body").on("click","#threeStep",function(){
    var userNameVal =  $(".accountGet").val();
    var password = $(".password").val();
    var repeatPassword = $(".repeatPassword").val();
    var email = $(".email").val();
    var securityAccess = $(".securityAccess").val();
    if(password==""){
        $(".passWordPromptLabel").html("密码不能为空，请重新输入！").css("visibility","visible");
        return;
    }
    if(repeatPassword==""){
        $(".passWordRepeatPromptLabel").html("密码不能为空，请重新输入！").css("visibility","visible");
        return;
    }
    else if(repeatPassword!=password){
        $(".passWordPromptLabel").html("两次输入密码不匹配，请重新输入！").css("visibility","visible");
        return;
    }
    password = hex_sha256(password)    //密码第一次加密
    $.post("/Users/ResetPasswordFinnal",{"userName":userNameVal,"password":password,"securityAccess":securityAccess},function(data){
        if(data==1){
            alert("密码修改成功，您可以返回登录！");
            window.location.href='userLogin'
        }else if(data==2){
            alert("请先完成邮箱验证！");
            window.location.reload();
        }else{
            alert("密码修改失败，请稍后再试！");
        }
    })
})
