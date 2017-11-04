$("#home").click(function(){
    alert("home");
});
$("#material").click(function(){
    alert("material");
});
$("#aboutus").click(function(){
    alert("aboutus");
});
$("#introduce").click(function(){
    $("#rightframe").attr("src","getexhibition");

    str = "<img src=\"webStatic/img/ShoppingCart/aboutUs/point.png\" width=\"20px\" height=\"20px\"><a >企业介绍</a>";
     $("#tips").empty().append(str);

});
$("#contactUs").click(function(){
    $("#rightframe").attr("src","getexhibition");
    str = "<img src=\"webStatic/img/ShoppingCart/aboutUs/point.png\" width=\"20px\" height=\"20px\"><a >联系我们</a>";
     $("#tips").empty().append(str);
});
$("#solve").click(function(){
    $("#rightframe").attr("src","getexhibition");
    str = "<img src=\"webStatic/img/ShoppingCart/aboutUs/point.png\" width=\"20px\" height=\"20px\"><a >常见解决方法</a>";
     $("#tips").empty().append(str);
});

