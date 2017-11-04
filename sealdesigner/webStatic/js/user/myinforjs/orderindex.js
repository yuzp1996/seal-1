/*个人中心信息管理js
于志鹏
2016/1/24*/
$(function(){
     getorder();
     xingming();
    $("#shouhuo").click(function(){
      shouhuo();
      })
    $("#suoyou").click(function(){
      getorder();
      })
    $("#yifu").click(function(){
      yifu();
      })
    $("#daifu").click(function(){
      daifu();
      })

})
//str+="<tr><td>"+jsonData[i].name+"</td><td>"+jsonData[i].city+"</td><td>"+jsonData[i].registerTime+"</td><td>"+jsonData[i].lastTime+"</td><td>"+jsonData[i].isShow+"</td><td><a class='look' href='#modal-container-183169' data-toggle='modal' id="+jsonData[i].userId+">查看</a>&nbsp;<a class='guanli'>管理</a></td></tr>";
 function  getorder()
 {

     $.post("/Users/getOrderInfo",function(data)
     {
         $(".list").empty();
         var str="";
         var jsonDataorder=$.parseJSON(data);
             for (var i in jsonDataorder)
             {str+="<tr><td >"+jsonDataorder[i].materialName+"</td><td>"+jsonDataorder[i].price +"RMB"+"</td><td>"+jsonDataorder[i].payName+"</td><td>"+jsonDataorder[i].orderDate+"</td></tr>";}
        $(".list").append(str);
     })

  }
   function  shouhuo()
 {
     $.post("/Users/getOrdershow",function(data)
     {
         $(".list").empty();
         var str="";
         var jsonDataorder=$.parseJSON(data);
             for (var i in jsonDataorder)
             {str+="<tr><td >"+jsonDataorder[i].orderId+"</td><td>"+jsonDataorder[i].isDeliver +"RMB"+"</td><td>"+jsonDataorder[i].logistics+"</td><td>"+jsonDataorder[i].orderDate+"</td><td>"+jsonDataorder[i].isPaid+"</td><td><button onclick=xinxi('"+jsonDataorder[i].orderId+"')>订单详情</button></td></tr>";}
        $(".list").append(str);
     })
  }

 function  yifu()
 {
     $.post("/Users/getOrdershowyifu",function(data)
     {
         $(".list").empty();
         var str="";
         var jsonDataorder=$.parseJSON(data);
             for (var i in jsonDataorder)
             {str+="<tr><td >"+jsonDataorder[i].orderId+"</td><td>"+jsonDataorder[i].isDeliver +"RMB"+"</td><td>"+jsonDataorder[i].logistics+"</td><td>"+jsonDataorder[i].orderDate+"</td><td>"+jsonDataorder[i].isPaid+"</td><td><button onclick=xinxi('"+jsonDataorder[i].orderId+"')>订单详情</button></td></tr>";}
        $(".list").append(str);

     })
  }

function  daifu()
 {
     $.post("/Users/getOrdershowdaifu",function(data)
     {
         $(".list").empty();
         var str="";
         var jsonDataorder=$.parseJSON(data);
             for (var i in jsonDataorder)
             {str+="<tr><td >"+jsonDataorder[i].orderId+"</td><td>"+jsonDataorder[i].isDeliver +"RMB"+"</td><td>"+jsonDataorder[i].logistics+"</td><td>"+jsonDataorder[i].orderDate+"</td><td>"+jsonDataorder[i].isPaid+"</td><td><button onclick=xinxi('"+jsonDataorder[i].orderId+"')>订单详情</button></td></tr>";}
        $(".list").append(str);

     })
 }

function xingming()
{
     $.post("/Users/getOrdershowdaifu",function(data)
     {
         var str1="";
         var jsonDataorder=$.parseJSON(data);
             for (var i in jsonDataorder)
             str1+=jsonDataorder[i].orderId;
        $("#trname").append(str1);

     })

}

