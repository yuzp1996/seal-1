$(function(){
    materialSearch();
    header();
    $.post("/Users/uerInfoInTop",function(data){
        if (data!=0){
            $(".rightArea").empty().append("<a href='/Users/personalCenter'style='margin-right:5px;color:white;'>"+data+"</a><a href='/Users/personalCenter' target='_blank'  style='margin-right:5px;color:white;'>[个人中心]</a><a href='/Users/userlogout' title='安全退出' style='color:white;'>[注销]</a>")
        }
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

/*返回顶部*/
$("body").on("click","#top",function(){
    $('html, body').animate({scrollTop:0}, 'slow');
});

/*
    后期修改
    胡丽
    2016/07/13
*/

/*收藏本站*/
function addFavorite() {
    var url = window.location;
    var title = document.title;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("360se") > -1) {
        alert("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");
    }else if (ua.indexOf("msie 8") > -1) {
        window.external.AddToFavoritesBar(url, title); //IE8
    }else if (document.all) {
      try{
        window.external.addFavorite(url, title);
      }catch(e){
        alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
      }
    } else if (window.sidebar) {
        window.sidebar.addPanel(title, url, "");
    } else {
        alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
    }
}

/*根据所在页面不同改变导航栏样式*/
function header(){
    var head=document.getElementById("header");
    var header=document.getElementById("header_choose").value;
    var header_index=document.getElementById("header_index");
    var header_seallist=document.getElementById("header_seallist");
    var header_trolley=document.getElementById("header_trolley");
    var header_personalcenter=document.getElementById("header_personalcenter");
    var header_myorder=document.getElementById("header_myorder");
    var header_aboutus=document.getElementById("header_aboutus");
    var header_modeldown=document.getElementById("header_modeldown");
    if(header=="index"){
//        head.style.borderBottom='#B81C20 0px solid';
        header_index.style.backgroundColor='#B81C20';
        header_index.style.color='white';
    }
    if(header=="seallist"){
        header_seallist.style.backgroundColor='#B81C20';
        header_seallist.style.color='white';
    }
    if(header=="trolley"){
        header_trolley.style.backgroundColor='#B81C20';
        header_trolley.style.color='white';
    }
    if(header=="personalcenter"){
        header_personalcenter.style.backgroundColor='#B81C20';
        header_personalcenter.style.color='white';
    }
    if(header=="myorder"){
        header_myorder.style.backgroundColor='#B81C20';
        header_myorder.style.color='white';
    }
    if(header=="aboutus"){
        header_aboutus.style.backgroundColor='#B81C20';
        header_aboutus.style.color='white';
    }
    if(header=="modeldown"){
        header_modeldown.style.backgroundColor='#B81C20';
        header_modeldown.style.color='white';
    }








}



//商品搜索

function materialSearch(){
$("body").on("click","#searchButton",function(){
var searchText=$("#searchText").val();
$.post("../ShoppingCart/materialSearch",{"searchText":searchText},function(data){
  window.location.href="../ShoppingCart/seallist?materialsId="+data;
})
})
}

