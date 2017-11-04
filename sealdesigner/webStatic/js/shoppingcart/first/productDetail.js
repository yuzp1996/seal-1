/*
    商品详情查看页面
*/
$(function(){
    if($("#parentClassId").val()==3)
    { $("#back").attr("href","");
      setTimeout( $("#back").attr("onclick","location.reload()"),10)
      }
    $.cookie("page",1);//默认当前页数是1
    getCommentList();
    if($(".parentClassId").val()=="3"){
        $(".number").show();
        $(".cor").show();
        $(".addCart").show();
        $(".selectButton").val("立即购买");
        $.post("/ShoppingCart/getMaterialColor",{"materialId":$(".materialId").val()},function(data){
            var jsonData=$.parseJSON(data);
            var str="";
            var option=jsonData[0].isColor;
            if(option){
//                str+="<option value='0'>请选择颜色</option>"
                for(var i in jsonData){
                    str+="<option value="+jsonData[i].colorId+">"+jsonData[i].colorName+"</option>"
                }
                $("#colorSelect").empty().append(str);
            }
            else{
                str+="<option value="+jsonData[0].colorId+">"+jsonData[0].colorName+"</option>";
//                str+="<option value='0'>不可配置</option>"
                $("#colorSelect").empty().append(str);
            }
        })
        }
    $.post("/ShoppingCart/lookMaterial",{"materialId":$(".materialId").val()},function(data){
        var jsonData=$.parseJSON(data);
        /*商品详情信息*/
        $(".name").empty().append(jsonData[0].materialName);
        price="￥"+jsonData[0].materialPrice;
        $(".price").empty().append(price);
        $(".remainder").empty().append(jsonData[0].materialRemainder);
        $(".intro").empty().append(jsonData[0].materialIntroduction);
        if(jsonData[0].picture!=null){
            $(".imgArea").attr("src",jsonData[0].picture);

        }
        $(".productIntroduction").empty().append(jsonData[0].materialInfo);
    })
})



/* 分 页 */
$("body").on("click",".pageNum",function(){
    if ( $.cookie("page")!=$(this).html()){  //判断点击的不是当前页
            $.cookie("page",$(this).html());
    }
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    getCommentList();
})
/*上一页*/
$("body").on("click",".pageUp",function(){
    var num = $.cookie("page");
    $.cookie("page",num-1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    getCommentList();
})

/*下一页*/
$("body").on("click",".pageDown",function(){
    var num = parseInt($.cookie("page"));
    $.cookie("page",num+1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    getCommentList();
})


/* 点击选择该商品按钮*/

$("body").on("click",".selectButton",function(){
    if($(".parentClassId").val()=="3"){
        submitseal();
    }else{
        window.location.href="/ShoppingCart/configureSeal?sealId="+$('.materialId').val();
    }
})
/*点击加入购物车*/
$("body").on("click",".addCart",function(){
    if($("#colorSelect").val()=="0"){
        alert("请选择颜色");
        return;
    }
    $.post("/ShoppingCart/submitSeal",{"materialId":$(".materialId").val(),"colorId":$("#colorSelect").val(),"number":$("#number").val()},function(data){
        if(data=="0"){
            alert("添加失败，请重新添加");
        }
        else if(data=="2"){
            alert("你还没有登录，请登录后再操作");
            window.location.href="/Users/userLogin";
            return
        }
        mask_layer();
        stopScroll();

    })
})

function mask_layer()
{
     $("#deleteOneStudentTip").fadeIn(200);
     $("#pictureid").val($(this).attr("id"));
     $("#putplace").val($(this).attr("place"));
     $("#bg").css({
            display: "block", height: $(document).height()
        });
        var $box = $('.box');
        $box.css({
            //设置弹出层距离左边的位置
            left: $("body").width()/2-150+"px",
            //设置弹出层距离上面的位置
            top: $(window).height()/3+"px",
            display: "block"
        });
}

function stopScroll()
{
    $ (window).scroll (function ()
    {
        $ (this).scrollTop (0)

    });
}



/*点击弹窗div  默认到商品列表*/
$("body").on("click","#alertDiv",function(){
    window.history.back(-1);
})
/*提交其它类商品订单*/

function submitseal(){
    if($("#colorSelect").val()=="0"){
        alert("请选择颜色");selectButton
        return;
    }
    $.post("/ShoppingCart/submitSeal",{"materialId":$(".materialId").val(),"colorId":$("#colorSelect").val(),"number":$("#number").val()},function(data){
        if(data=="0"){
            alert("选择失败，请重新选择");
//            window.history.back(-1);
        }else if(data=="2"){
            alert("你还没有登录，请登录后再操作");
            window.location.href="/Users/userLogin";
        }
        else{
             var jsonData=$.parseJSON(data);
             window.location.href="/ShoppingCart/submitOrder?trollerId="+jsonData[0].trollerId;
        }
    })
}

/* 加载评论列表*/

function getCommentList(){
    $.post("/ShoppingCart/getCommentList",{"materialId":$(".materialId").val(),"page":$.cookie("page")},function(data){
        if(data=="1"){
            $(".numb").empty().append("<td>(0)</td>");
            var str="";
            str+="<p>暂无评论</p>";
            $(".comment").empty().append(str);

//            document.getElementById("comments").innerHTML="<p>暂无评论</p>";
        }else{
            var jsonData=$.parseJSON(data);
            var num=jsonData.length;
            var st="";
            st +="<td>("+num+")</td>";
            $(".numb").empty().append(st);
            var str="";
            for(var i in jsonData){
                str+="<div class='productAppraise'><div class='appraisePicture'><img src='/webStatic/img/ShoppingCart/user.jpg' class='commentsImg'/></div><div class='appraiseContent'>";
                str+="<table><tr><td>"+jsonData[i].commentContent+"</td></tr><th></th><tr><td>"+jsonData[i].createTime+"</td></tr></table></div></div>";
            }
            $(".comment").empty().append(str);
            $.cookie("pageCount",jsonData[0].num);
            if(jsonData[0].num!=0){
                $(".page").empty().append(pageJs(jsonData[0].num,10));//加载分页列表
             }
         }
    })
}
