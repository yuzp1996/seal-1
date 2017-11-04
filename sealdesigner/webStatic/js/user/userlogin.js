/*
前台登录界面js
王志文
2016/4/19
*/
$(function(){

    imgShow();
    validateReload();
    $(".userName").val("");
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
    })
    $("#header").remove();  //删除指定div
});
/*刷新验证码*/
function validateReload(){
    $.post("/ShoppingCart/validate",function(data){
        $("#indexcode").empty().append("<img id='imValidate'  src='data: image/gif;base64,"+data+"'/>");
    });
}
/*点击刷新验证码*/
$("body").on("click","#indexcode",function(){
    validateReload();
})

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
        $(".centerArea").css("background-image","url("+backgroundPicUrl+")")
    })
}

$("body").on("focus",".userName",function(){
    $(".userNamePromptLabel").hide();
})
$("body").on("focus",".passWord",function(){
    $(".passWordPromptLabel").hide();
})
$("body").on("focus",".Input_verify",function(){
    $(".Input_verifyRepeatPromptLabel").html("验证码不区分大小写").css("display","block");
})
$("body").on("blur",".Input_verify",function(){
    $(".Input_verifyRepeatPromptLabel").hide();
})

$("body").on("click", ".button",function(){
    var userNameVal =  $(".userName").val();
    var passWordVal = $(".passWord").val();
    var Input_verifyVal = $(".Input_verify").val();
    var userNamePromptLabel= $(".userNamePromptLabel");
    var passWordPromptLabel=$(".passWordPromptLabel");

    if (userNameVal==""){
        userNamePromptLabel.html("用户名不能为空！请重新输入").css("display","block");
        validateReload();
        return ;
    }
    if (passWordVal==""){
        passWordPromptLabel.html("密码不能为空！").css("display","block");
        validateReload();
        return ;
    }
    if (Input_verifyVal==""){
        $(".Input_verifyRepeatPromptLabel").html("验证码不能为空！请重新输入").css("display","block");
        validateReload();
        return ;
    }
    passWordVal = hex_sha256(passWordVal)  //密码加密
    $(".userNamePromptLabel, .emailPromptLabel, .passWordPromptLabel, .passWordRepeatPromptLabel, .Input_verifyRepeatPromptLabel").css("display","none");

    $.post("/Users/userLogin",{"userName":userNameVal,"passWord":passWordVal,"Input_verify":Input_verifyVal},function(data){
        if (data=="1"){
//          注册
            var register = $(".register").val();
            if (register == "True"){
                window.location.href="/";
            }else{
                window.history.back(-1);
            }
            // window.location.href="/Users/userlogin";
        }else if(data=="2"){
            $(".Input_verifyRepeatPromptLabel").html("验证码错误！请重新输入").css("display","block");
            validateReload();
            return ;
        }else if (data=="3"){
            userNamePromptLabel.html("用户名不存在！请重新输入").css("display","block");
            validateReload();
            return ;
        }else if (data=="4") {
            passWordPromptLabel.html("密码错误!请重新输入").css("display","block");
            validateReload();
            return ;
        }else if (data=="5"){
        	alert('对不起,您的帐号已被管理员禁用,请即时与管理员联系!');
        	return ;
        }else {
        	alert("登录失败,请稍后重试!");
        	validateReload();
            return ;
        }
    })
})

