$(function(){
    getid();
    getChapter();
    seal_materia();
    materialGetCommodity();
    cssChange();
    afterSearch();
    onMouseOver();
});

/*搜索进入商品列表*/
function afterSearch(){
if ($("#materialsId").val()!=="")
{
$.post("searchMaterials",{"materialsId":$("#materialsId").val()},function(data){
       setTimeout(function time(){
       if (data=="noSuchThing")
           {
            str="<div style='text-align:center;font-size:16px'><img src='../webStatic/img/ShoppingCart/sorry.png' style='width:100px;height:100px'>很抱歉，没有找到您想要的商品，不如筛选一下吧~~~<img src='../webStatic/img/ShoppingCart/pleaseSelect.png' style='width:100px;height:100px'></div>"
            $(".big_box").empty().append(str);
           }
       else
           {
           var jsonData=$.parseJSON(data);
            var str="";
            for(var i in jsonData){
            str+="<div class='seal_img_box'><a href='/ShoppingCart/productDetails?materialId="+jsonData[i].materialId+"'class='incomorenew' onfocus=this.blur();><div class='mask-layer'></div><div class='span'><span class='span2'><img src='../webStatic/img/ShoppingCart/heisezi.png' class='span-img' style='margin-left:-45%;margin-top:-2px'><span class='span-p' ><p>古人篆刻思离群,舒卷浑同岭上云.<br>&nbsp&nbsp看到六朝唐宋妙,何曾墨守汉家文.</p></span></span><br><span class='span-name'>"+jsonData[i].materialName+"</span><br><br><span class='span-introduce' style='margin-left:-3%;margin-top:5%'>&nbsp&nbsp&nbsp&nbsp"+jsonData[i].materialIntroduction+"</span><br><span ><img src='../webStatic/img/ShoppingCart/dericte.png'; class='span-img'; style='margin-top:25px'></span></div><div class='seal_img1'><div class='seal_img'><img class='samLazyImg' src="+jsonData[i].picUrl+">&nbsp&nbsp&nbsp&nbsp<p class= 'seal_price'>&nbsp&nbsp&nbsp￥"+jsonData[i].materialPrice+"</p><br>&nbsp&nbsp&nbsp&nbsp<span class='name'>["+jsonData[i].materialName+"]</span><br>&nbsp&nbsp&nbsp&nbsp简介：<br><span class='introduce1'>&nbsp&nbsp&nbsp"+jsonData[i].materialIntroduction+"</span></div></div></a></div>" }
            $(".big_box").empty().append(str);
            }}
,10)

})
}
      $("#materialsId").val("");

}




/*商品筛选 父类数据加载*/
function getChapter(){
    $.post("/Seal/getChapter",function(data){
        var jsonData=$.parseJSON(data);
        var str="";
        for(var i in jsonData){
            str+="<dd id="+jsonData[i].id+"><a href='#' id="+jsonData[i].id+">"+jsonData[i].name+"</a></dd>"
        }
        $("#select1").append(str);
    });
}

/*商品筛选 材料分类加载*/
function seal_materia(){
    $.post("seal_materia",function(data){
        var jsonData=$.parseJSON(data);
        var str="";
        for(var i in jsonData){
            str+="<dd id="+jsonData[i].materia1+"><a href='#' id="+jsonData[i].materia1+">"+jsonData[i].materia2+"</a></dd>"
        }
        $("#select3").append(str);
    });
}

/*排序 样式实现*/
function cssChange(){
    $("#all").css({
        "background-image":"linear-gradient(#599BDC, #3072B3)",
        "color":"#fff"
    });
    if ($(this).css("background-image","linear-gradient(#F4F4F4, #ECECEC)")) {
        $(".sort1").click(function(){
            $(".sort1").css({
                "background-image":"linear-gradient(#F4F4F4, #ECECEC)",
                "color":"#333"
            });
            $(this).css("background-image","linear-gradient(#599BDC, #3072B3)");
            $(this).css("color","#fff");
        });
    };
}




/*商品筛选界面动态效果实现*/
$("body").on("click","#select1 dd",function(){
    $("#selectB").remove();
    select1id=this.id
    $(this).addClass("selected").siblings().removeClass("selected");
    if (select1id=="11"){
        $("#select2").empty()
        materialGetCommodity()
        $("#selectA").remove();
    }
    else{
        var copyThisA = $(this).clone();
        if ($("#selectA").length > 0) {/*如果已经存在选择条件*/
            $("#selectA a").html($(this).text());
            sealClassChange();
        }
        else {/*如果还不存在选择条件*/
            sealClassChange();
            $(".select-result dl").append(copyThisA.attr("id", "selectA"));
        }
    }
})


/*联动改变商品子类的值*/
function sealClassChange(){
    $.post( "sealClassChange",{"select1id":select1id},function(data){
        var jsonData=$.parseJSON(data);
        var str="<dt>子分类：</dt><dd class='select-all selected' id=0 ><a href='#' id=0>全部</a></dd>";
        for(var i in jsonData){
            str+="<dd id="+jsonData[i].id+"><a href='#' id="+jsonData[i].id+">"+jsonData[i].name+"</a></dd>"
        }
        $("#select2").empty().append(str);
    })
}
/*展示商品子分类*/
function materialGetCommodity(){
     $.post("/Seal/getCommodity",function(data){
        var jsonData=$.parseJSON(data);
        var str="<dt>子分类：</dt><dd class='select-all selected'id=0><a href='#' id=0>全部</a></dd>";
        for(var i in jsonData){
            str+="<dd id="+jsonData[i].id+"><a href='#' id="+jsonData[i].id+">"+jsonData[i].name+"</a></dd>"
        }
        $("#select2").empty().append(str);
    });
}

/**/
$("body").on("click","#select2 dd",function(){
    $(this).addClass("selected").siblings().removeClass("selected");
    if ($(this).hasClass("select-all")) {
        $("#selectB").remove();
    }
    else {
        var copyThisB = $(this).clone();
        if ($("#selectB").length > 0) {
            $("#selectB a").html($(this).text());
        }
        else {
            $(".select-result dl").append(copyThisB.attr("id", "selectB"));
        }
    }
});

$("body").on("click","#select3 dd",function(){
    $(this).addClass("selected").siblings().removeClass("selected");
    if ($(this).hasClass("select-all")) {
        $("#selectC").remove();
    }
    else {
        var copyThisC = $(this).clone();
        if ($("#selectC").length > 0) {
            $("#selectC a").html($(this).text());
        }
        else {
            $(".select-result dl").append(copyThisC.attr("id", "selectC"));;
        }
    }
});

$("#selectA").live("click", function () {
    $(this).remove();
    $("#select1 .select-all").addClass("selected").siblings().removeClass("selected");
});

$("#selectB").live("click", function () {
    $(this).remove();
    $("#select2 .select-all").addClass("selected").siblings().removeClass("selected");
});

$("#selectC").live("click", function () {
    $(this).remove();
    $("#select3 .select-all").addClass("selected").siblings().removeClass("selected");
});
$(".select dd").live("click", function () {
    if ($(".select-result dd").length > 1) {
        $(".select-no").hide();
    } else {
        $(".select-no").show();
    }
});

/*获取筛选条件的id值展示商品*/
function getid(){
    var selected1=0;
    var selected2=0;
    var selected3=0;
    var selected11=0;
    $("#select1").on("click","#select1 a",function(){
        selected1 =$(this).attr("id");
        selected11=selected1;
        selected2=0;
    })
    $("#select2").on("click","#select2 a",function(){
        selected2 =$(this).attr("id");
//        selected1=0;
    })
    $("#select3").on("click","#select3 a",function(){
        selected3 =$(this).attr("id");
    })

    $(".select-result").on("click","#selectA a",function(){
        selected1=0;
    })
    $(".select-result").on("click","#selectB a",function(){
        selected2=0;
        if(document.getElementById("selectA"))
        {
            selected1=selected11;
        }
        else{
            selected1=0;
        }
    })
    $(".select-result").on("click","#selectC a",function(){
        selected3=0;
    })
    $.post("choseShow",{"selected1":selected1,"selected2":selected2,"selected3":selected3},function(data){
        var jsonData=$.parseJSON(data);
        var str="";
        for(var i in jsonData){
            if (i < 11) {
                str+="<div class='seal_img_box'><a href='/ShoppingCart/productDetails?materialId="+jsonData[i].materialId+"'class='incomorenew' onfocus=this.blur();><div class='mask-layer'></div><div class='span'><span class='span2'><img src='../webStatic/img/ShoppingCart/heisezi.png' class='span-img' style='margin-left:-45%;margin-top:-2px'><span class='span-p' ><p>古人篆刻思离群,舒卷浑同岭上云.<br>&nbsp&nbsp看到六朝唐宋妙,何曾墨守汉家文.</p></span></span><br><span class='span-name'>"+jsonData[i].materialName+"</span><br><br><span class='span-introduce' style='margin-left:-3%;margin-top:5%'>&nbsp&nbsp&nbsp&nbsp"+jsonData[i].materialIntroduction+"</span><br><span ><img src='../webStatic/img/ShoppingCart/dericte.png'; class='span-img'; style='margin-top:25px'></span></div><div class='seal_img1'><div class='seal_img'><img src="+jsonData[i].picUrl+">&nbsp&nbsp&nbsp&nbsp<p class= 'seal_price'>&nbsp&nbsp&nbsp￥"+jsonData[i].materialPrice+"</p><br>&nbsp&nbsp&nbsp&nbsp<span class='name'>["+jsonData[i].materialName+"]</span><br>&nbsp&nbsp&nbsp&nbsp简介：<br><span class='introduce1'>&nbsp&nbsp&nbsp&nbsp"+jsonData[i].materialIntroduction+"</span></div></div></a></div>"
            }
            else{
                str+="<div class='seal_img_box'><a href='/ShoppingCart/productDetails?materialId="+jsonData[i].materialId+"'class='incomorenew' onfocus=this.blur();><div class='mask-layer'></div><div class='span'><span class='span2'><img src='../webStatic/img/ShoppingCart/heisezi.png' class='span-img' style='margin-left:-45%;margin-top:-2px'><span class='span-p' ><p>古人篆刻思离群,舒卷浑同岭上云.<br>&nbsp&nbsp看到六朝唐宋妙,何曾墨守汉家文.</p></span></span><br><span class='span-name'><center>"+jsonData[i].materialName+"</center></span><br><br><span class='span-introduce' style='margin-left:12%;margin-top:5%'>&nbsp&nbsp&nbsp&nbsp"+jsonData[i].materialIntroduction+"</span><br><span ><img src='../webStatic/img/ShoppingCart/dericte.png'; class='span-img'; style='margin-top:20px'></span></div><div class='seal_img1'><div class='seal_img'><img class='lazyimg' src='../webStatic/img/load.jpg' data-src="+jsonData[i].picUrl+">&nbsp&nbsp&nbsp&nbsp<p class= 'seal_price'>&nbsp&nbsp&nbsp￥"+jsonData[i].materialPrice+"</p><br>&nbsp&nbsp&nbsp&nbsp<span class='name'>["+jsonData[i].materialName+"]</span><br>&nbsp&nbsp&nbsp&nbsp简介：<span class='introduce1'>&nbsp&nbsp&nbsp"+jsonData[i].materialIntroduction+"</span></div></div></a></div>"
            }
        }
        $(".big_box").empty().append(str);
    })
    $(".select").on("click","a",function(data){
        $.post("choseShow",{"selected1":selected1,"selected2":selected2,"selected3":selected3},function(data){
            var jsonData=$.parseJSON(data);
            var str="";
            for(var i in jsonData){
                if (i < 11) {
                str+="<div class='seal_img_box'><a href='/ShoppingCart/productDetails?materialId="+jsonData[i].materialId+"'class='incomorenew' onfocus=this.blur();><div class='mask-layer'></div><div class='span'><span class='span2'><img src='../webStatic/img/ShoppingCart/heisezi.png' class='span-img' style='margin-left:-45%;margin-top:-2px'><span class='span-p' ><p>古人篆刻思离群,舒卷浑同岭上云.<br>&nbsp&nbsp看到六朝唐宋妙,何曾墨守汉家文.</p></span></span><br><span class='span-name'>"+jsonData[i].materialName+"</span><br><br><span class='span-introduce' style='margin-left:-3%;margin-top:5%'>&nbsp&nbsp&nbsp&nbsp"+jsonData[i].materialIntroduction+"</span><br><span ><img src='../webStatic/img/ShoppingCart/dericte.png'; class='span-img'; style='margin-top:25px'></span></div><div class='seal_img1'><div class='seal_img'><img src="+jsonData[i].picUrl+">&nbsp&nbsp&nbsp&nbsp<p class= 'seal_price'>&nbsp&nbsp&nbsp￥"+jsonData[i].materialPrice+"</p><br>&nbsp&nbsp&nbsp&nbsp<span class='name'>["+jsonData[i].materialName+"]</span><br>&nbsp&nbsp&nbsp&nbsp简介：<br><span class='introduce1'>&nbsp&nbsp&nbsp&nbsp"+jsonData[i].materialIntroduction+"</span></div></div></a></div>"
                }
                else{
                    str+="<div class='seal_img_box'><a href='/ShoppingCart/productDetails?materialId="+jsonData[i].materialId+"'class='incomorenew' onfocus=this.blur();><div class='mask-layer'></div><div class='span'><span class='span2'><img src='../webStatic/img/ShoppingCart/heisezi.png' class='span-img' style='margin-left:-45%;margin-top:-2px'><span class='span-p'><p>古人篆刻思离群,舒卷浑同岭上云.<br>&nbsp&nbsp看到六朝唐宋妙,何曾墨守汉家文.</p></span></span><br><span class='span-name'><center>"+jsonData[i].materialName+"</center></span><br><br><span class='span-introduce' style='margin-left:12%;margin-top:5%'>&nbsp&nbsp&nbsp&nbsp"+jsonData[i].materialIntroduction+"</span><br><span ><img src='../webStatic/img/ShoppingCart/dericte.png'; class='span-img'; style='margin-top:20px'></span></div><div class='seal_img1'><div class='seal_img'><img class='lazyimg' src='../webStatic/img/load.jpg' data-src="+jsonData[i].picUrl+">&nbsp&nbsp&nbsp&nbsp<p class= 'seal_price'>&nbsp&nbsp&nbsp￥"+jsonData[i].materialPrice+"</p><br>&nbsp&nbsp&nbsp&nbsp<span class='name'>["+jsonData[i].materialName+"]</span><br>&nbsp&nbsp&nbsp&nbsp简介：<span class='introduce1'>&nbsp&nbsp&nbsp"+jsonData[i].materialIntroduction+"</span></div></div></a></div>"
                }
            }
            $(".big_box").empty().append(str);
            /*筛选结果为空时显示效果*/
            var test=document.getElementsByClassName('seal_img_box');
            if(test.length==0){
                str="<div style='text-align:center;font-size:16px'><img src='../webStatic/img/ShoppingCart/sorry.png' style='width:100px;height:100px'>很抱歉，没有筛选到您想要的商品，再看看其它的吧~~~</div>"
                $(".big_box").empty().append(str);
            }
        })
    })
}




function onMouseOver(){
$("body").on("mouseenter",".seal_img_box",function(){
    $(this).children("a").children("div .span").css("display","block");
    $(this).children("a").children("div .mask-layer").css("display","block");
    }
)
$("body").on("mouseleave",".seal_img_box",function(){
    $(this).children("a").children("div .span").css("display","none");
    $(this).children("a").children("div .mask-layer").css("display","none");
})
}



/*缓加载修正    胡丽   2016/10/05*/
$(window).bind("scroll", function(event){
    $(".lazyimg").each(function(){
        //窗口的高度+看不见的顶部的高度=屏幕低部距离最顶部的高度  
        var thisButtomTop = parseInt($(window).height()) + parseInt($(window).scrollTop());  
        var thisTop = parseInt($(window).scrollTop()); //屏幕顶部距离最顶部的高度  
        var PictureTop = parseInt($(this).offset().top);  
        if (PictureTop >= thisTop && PictureTop <= thisButtomTop && $(this).attr("data-src") != $(this).attr("src")) {
            $(this).attr("src", $(this).attr("data-src")); 
        }
    });
})