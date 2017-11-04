$(function(){
    getNewsList();
    onMouseOver();
})



//首页轮播展示图片
$(function(){
    $.post("/ShoppingCart/indexPicture",function(data){
        var jsonData=$.parseJSON(data);
        for(var i in jsonData){
            $(".picture").eq(i).attr("src",jsonData[i].picUrl);
        }
    })
})

//获取新闻列表
function getNewsList(){
    $.post("/ShoppingCart/getNewsList", function (data) {
        var str="";
        var jsonData=$.parseJSON(data);
        for(var i in jsonData){
            if(jsonData[i].newsType == 1){
                str+="<li><a id='newsDetail' style='color: red;' href='/ShoppingCart/newsContent?newsId=" +jsonData[i].newsId+ "'><span>[" + jsonData[i].createTime +"</span>"+jsonData[i].title +"</a></li>";
            }
            else {
                str+="<li><a style='color: red;' href=" +jsonData[i].link+ " target='_blank'><span>[" + jsonData[i].createTime +"</span>"+jsonData[i].title +"</a></li>";
            }
        }
        $("#scrollDivUl").append(str);
    })
}
//领取优惠劵
$("body").on("click",".indexPrivilege",function(){
    var privilegeTypeId = $(this).attr("id");
    $.post("/ShoppingCart/privilege",{"privilegeTypeId":privilegeTypeId},function(data){
        if(data==4){
            alert("请先登录再领取优惠劵！");
        }
        else if(data==1){
            alert("优惠劵领取成功！");
        }
        else if(data==2){
            alert("优惠劵已领取完！");
        }
        else if(data==3){
            alert("该优惠券已经领取！")
        }
        else{
            alert("优惠劵领取失败！")
        }
    })
})


///*鼠标放置到商品出 出现遮罩蒙层效果*/
function onMouseOver(){
$("body").on("mouseenter",".seal_img_box",function(){
    $(this).children("a").children("div .span").css("display","block");
    $(this).children("a").children("div .mask-layer").css("display","block");
})

$("body").on("mouseleave",".seal_img_box",function(){
    $(this).children("a").children("div .span").css("display","none");
    $(this).children("a").children("div .mask-layer").css("display","none");
})
}

