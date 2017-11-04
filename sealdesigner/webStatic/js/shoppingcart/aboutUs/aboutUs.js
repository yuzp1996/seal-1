/*企业介绍文本----样式设置*/
$(function(){
    $(".middleState p span").css({
        "font-size":"15px",
        "font-family": "仿宋_gb2312",
        "display":"block" ,
        "text-indent":"2em",  //让段落开头空两个字
    })
    $(".middleState p strong span").css({
        "font-size":"25px",
        "display": "block",
        "margin-top":"20px",
    })
    $(".middleState p strong span img").css({
        "height":"370px",
//        "width":$(".middleState").width()/2.5,
        "width":"380px",
        "margin-right":"15px",
        "padding": "7% 5% 0% 0%",
        "float":"left",
    });
    $(".middleState p span:first").css({
        "font-size":" 50px",
        "font-family": "仿宋_gb2312",
        "display": "block",
        "padding": "4% 10% 5% 0%",
    })
})

/*常见问题解决方法----样式设置*/
$(function(){
    $(".problemContent p:even").css({    // 索引从0开始，选取偶数段落
        "color":"red",
    })
})

/*联系我们----样式设置*/
$(function(){
    $(".middleStateContent p span:first").css({
        "padding":"",
    })
})