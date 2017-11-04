
$(function(){
    $.cookie("page",1);       //默认当前页数为1
    $("#allTrolleyId").attr("value","")
    getTrolley();
    getCount(o);
    menuHandler();
    flipMenu();
    showMenu();
    hideMenu();
})


/* 分 页 */
$("body").on("click",".pageNum",function(){
    if ( $.cookie("page")!=$(this).html()){  //判断点击的不是当前页
            $.cookie("page",$(this).html());
    }
    $(".page").empty().append(pageJs($.cookie("pageCount"),5));
    getTrolley();
})
/*上一页*/
$("body").on("click",".pageUp",function(){
    var num = $.cookie("page");
    $.cookie("page",num-1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),5));
    getTrolley();
})

/*下一页*/
$("body").on("click",".pageDown",function(){
    var num = parseInt($.cookie("page"));
    $.cookie("page",num+1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),5));
    getTrolley();
})



/*页面开始时加载购物车列表*/
function getTrolley(jsonStr){
    var userName="";
    $.post("/Users/getUserName",function(data){
    userName=data;
    jsonStr = $.extend({},jsonStr,{"page":$.cookie("page")},{"userName":userName});
    $.post("/ShoppingCart/TrolleyInfo",jsonStr,function(data){
        var jsonData=$.parseJSON(data);
        var str="";
        for(var i in jsonData){
           if (jsonData[i].parentName=="其他")
               var mateClass="0"
//                   0代表为其他类
            else
               var mateClass="1"
//                   1代表印章
            str+="<tr><td><input id='"+jsonData[i].trolleyId+"' name='"+jsonData[i].parentName+"' type='checkbox' onclick='getCount(this)'stop='"+jsonData[i].stop+"' value='"+jsonData[i].amount+"' autocomplete='off'></td><td><img src="+jsonData[i].pictureUrl+" class='trolleyImg'>"+jsonData[i].materialName+"</td><td>"+jsonData[i].parentName+"</td><td>"+jsonData[i].number+"</td><td style='display:none'>"+jsonData[i].status+"</td><td>"+jsonData[i].amount+"</td><td><a href='../ShoppingCart/TrolleyInfoLoadTwo?trolleyId="+jsonData[i].trolleyId+"&comeFrom="+12345+"'><i title='详情'/>详情&nbsp&nbsp&nbsp&nbsp</a><a id='"+jsonData[i].trolleyId+"'class='deleteShopping'><i title='删除'/>删除 </a></td></tr>"

        }
        if (str == ""){
            str += "<tr><td colspan='6'>购入车里没有宝贝哦，<a href='/ShoppingCart/seallist'>赶紧行动吧</a></td></tr>";
        }else{
            $.cookie("pageCount",jsonData[0].num);
            if (jsonData[0].num!=0){
            $(".page").empty().append(pageJs(jsonData[0].num,5));    //加载分页列表
            }
        }
        $("#trolleyList").empty().append(str);
    })
  });
}


//删除购物车
$("body").on("click",".deleteShopping",function(){
     $("#firstShoppingId").val($(this).attr("id"));
     if (confirm("是否确认删除"))
     {$.post("../ShoppingCart/deleteShoppingCart",{"firstShoppingId":$("#firstShoppingId").val()},function(data){
                if(data==1){alert("删除成功");}
                else{alert("删除失败");}
              location.reload();
            });
     }
})

/*点击多选框进行购物车底部合计*/
var num=0;
var price=0;
var allTrolleyId=""
/*点击多选框进行购物车底部合计*/
function getCount(o){
    if(o.checked){num++;}
    else{num--;}
    $("#accNum").empty().append('已选'+num+'件');
	price+=parseFloat(o.checked?o.value:-o.value);
	$("#accPri").empty().append('合计：¥'+price.toFixed(2));
	$("#allTrolleyId").attr("value",allTrolleyId)
}

/*delete many ShoppingCart */

$("#del").on("click","",function(){
    var nodes = document.getElementsByTagName("input");
    var array=[];
    var s = "";
    var change=0,num1=0;
    var j=0;
    for(var i=0;i<nodes.length;i++){
        if(nodes[i].type=="checkbox" && nodes[i].checked){
            array[j]=$(nodes[i]).attr("id");
            s=array.join('!');
            j++;
        }
    }

     if(s==""){
         alert("请选择要删除的商品！")
     }
    else{
            if (confirm("是否确认删除"))
             {$.post("../ShoppingCart/deleteShoppingCart",{"firstShoppingId":s},function(data){
                        if(data==1){alert("删除成功");}
                        else{alert("删除失败");}
                      location.reload();
                    });
              }
     }
}
)


/*获取已选checkbox的商品id传送至提交订单页面*/
$("#go").on("click","",function()
{
    var nodes = document.getElementsByTagName("input");
    var array=[];
    var s =0;
    var j=0,stop=0;
    for(var i=0;i<nodes.length;i++){
        if(nodes[i].type=="checkbox" && nodes[i].checked){
            array[j]=$(nodes[i]).attr("id");
            s=array.join('!');
            stop+=parseInt($(nodes[i]).attr("stop"))
            j++;
        }
    }
    if(s==""){
        alert("请选择要购买的商品！");
     }else{
         if (stop==0)
             window.location.href="/ShoppingCart/submitOrder?trollerId="+s;
         else
         {
         alert("所选公章上传资料不完整，请检查")
         }
        }
})



//$("body").on("click",":checkbox",function(){
//    var nodes = document.getElementsByTagName("input");
//    var time=0;
//    for(var i=0;i<nodes.length;i++)
//    {
//        var val = 0;
////            对所有input循环
//        if(nodes[i].type=="checkbox")
//        {
//            if (typeof($(nodes[i]).attr("stop"))=="undefined")
//                {
//                    var str= $(nodes[i]).attr("name")
//                    if(str=="公章")
//                    //如果这个是公章
//                    {   time+=1;
//                        $.post("../ShoppingCart/dataIsUpload",{"trolleyId":$(nodes[i]).attr("id"),"mateClass":2},function(data)
//                                {
//                                    var jsonData=$.parseJSON(data);
//                                    console.log(jsonData)
//                                    $.each(jsonData, function (name, value)
//                                            {
//                                                val+= parseInt(value)
//                                            }
//                                           )
//                                }
//                               )
//                                $(nodes[i]).attr("stop",val);
//
//
//                   }
//
//                  else{
//                    $(nodes[i]).attr("stop",0)
//                    }
//                }
//
//        }
//     }
//}
//)




/*优惠券点击效果*/
var visMnu = "";
var actMnu;
function flipMenu(actMnu){
    if (visMnu == "")
        showMenu(actMnu);
    else{
        if (visMnu == actMnu)
            hideMenu(actMnu);
        else{
            hideMenu(visMnu);
            showMenu(actMnu);
        }
    }
}
function showMenu(actMnu){
    actMnu.style.display = "block";
    visMnu = actMnu;
}
function hideMenu(actMnu){
    actMnu.style.display = "none";
    visMnu = "";
}




/*详情页面数量增减效果*/
$("#bookNum").keypress(function(b) {
    var keyCode = b.keyCode ? b.keyCode : b.charCode;
    if (keyCode != 0 && (keyCode < 48 || keyCode > 57) && keyCode != 8 && keyCode != 37 && keyCode != 39) {
        return false;
    }
    else{
        return true;
    }
})
.keyup(function(e) {
    var keyCode = e.keyCode ? e.keyCode : e.charCode;
    console.log(keyCode);
    if (keyCode != 8) {
        var numVal = parseInt($("#bookNum").val()) || 0;
        numVal = numVal < 1 ? 1 : numVal;
        $("#bookNum").val(numVal);
    }
})
.blur(function() {
    var numVal = parseInt($("#bookNum").val()) || 0;
    numVal = numVal < 1 ? 1 : numVal;
    $("#bookNum").val(numVal);
});
//增加
$("#add").click(function() {
    var num = parseInt($("#bookNum").val()) || 0;
    $("#bookNum").val(num + 1);
    var price=document.getElementById('price').innerHTML;
    var amount=(num+1)*price;
    document.getElementById('amount').innerHTML = amount;
});
//减去
$("#sub").click(function() {
    var num = parseInt($("#bookNum").val()) || 0;
    num = num - 1;
    num = num < 1 ? 1 : num;
    $("#bookNum").val(num);
    var price=document.getElementById('price').innerHTML;
    var amount=num*price;
    document.getElementById('amount').innerHTML = amount;
});




//修改购物车
$("#sure").click(function(){
   if ($("#mateClass").val()==0)//如果为其他类
      if (colorName.style.display=="none")//如果发生修改行为
           $.post("../ShoppingCart/changeOfShoppingCart",{"sealClass":"0","trolleyId":$("#trolleyId").val(),"number":$("#bookNum").val(),"colorId":$("#colorNameB").val()},
           function(data)
           {if (data==1)
               {alert("修改成功")
                window.location='../Users/trolley'}
            else {alert("修改失败")}
           }
           )
      else{window.location='../Users/trolley'}
   else  if($("#mateClass").val()==1)//为印章
      {alert("正在建设")}

})