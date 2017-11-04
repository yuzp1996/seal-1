/*
订单评价
*/
$(function(){
    getMaterialInformation();
})


function getMaterialInformation(){
    $.post("/Users/getMaterialInformation",{"materialId":$(".materialId").val(),"trollerId":$(".trollerId").val()},function(data){
        var jsonData = $.parseJSON(data);
        var str="";
        for(var i in jsonData){
            str+="<div class='orderEvaluate'><div class='evaluate-content'><div class='evaluate-left'><img src="+jsonData[i].picture+" class='orderEvaluatePicture'/><p style='margin-top:8px;margin-left:35px;'>商品名称：<td>"+jsonData[i].materialName+"</td></p></div>";
            if(jsonData[i].isComment){
                str+="<div class='evaluate-right'><textarea readonly='true' class='evaluateText'maxlength='500'style='height:150px;'>"+jsonData[i].commentContent+"</textarea><input class='button-back' type='button'value='返回'style='display:inline;float:right;width:80px;height:40px;margin:5px 20px 5px 0px;'></div></div></div>";
            }else{
                str+="<div class='evaluate-right'><textarea class='evaluateText'maxlength='500'style='height:150px;'></textarea><input class='addComment'type='button'value='发表评论'id="+jsonData[i].materialId+" style='display:inline;float:right;width:80px;height:40px;margin:5px 20px 5px 0px;'></div></div></div>";
            }
            $(".evaluate").empty().append(str);
        }
    })
}

/*点击评论*/
$("body").on("click",".addComment",function(){
    if($(".evaluateText").val()==""){
        alert("评论内容不能为空！");
        $(".evaluateText").focus();
        return;
    }else{
        $.post("/Users/addComment",{"materialId":$(".materialId").val(),"trollerId":$(".trollerId").val(),"commentContent":$(".evaluateText").val()},function(data){
            if(data=="1"){
                alert("评论成功");
                window.history.back(-1);
            }else{
                alert("评论失败");
            }
        })
    }
})

/*点击返回*/
$("body").on("click",".button-back",function(){
    window.history.back(-1);
//    window.location.href="/Users/myOrder";//要重新加载一下页面。
})