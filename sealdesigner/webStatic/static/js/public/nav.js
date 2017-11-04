$(function(){
    $.post("/Users/uerInfoInTop",function(data){
        $(".rightArea").empty().append("欢迎您的到来！<a href='/Users/personalCenter' title='个人中心' style='margin-right:5px;color:red;'>"+data+"</a><a href='/Users/userlogout' title='安全退出'>注销</a>")
    })
    $.post("/Users/imgShow",function(data){
        var jsonData = $.parseJSON(data);
        var logoPicUrl="";
        for (i in jsonData){
            if (jsonData[i].picPlace=="1"){
                logoPicUrl = jsonData[i].picUrl;
            }
        }
        $(".logoImg").attr("src",logoPicUrl);
    })
})