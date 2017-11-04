$(function(){

    if ($.cookie("FirstLogin")=="yes")
        idused=1.1
    else
        idused=0
        $.cookie("FirstLogin","yes")

    if($("#stopJs").val()==("stop"))
        return false
    else
        {setTimeout(NewsComing(idused),1000)}


    $("#jplayer").jPlayer({
      swfPath: "/webStatic/downloads/22.mp3",
      ready: function () {
        $(this).jPlayer("setMedia", {
          mp3: "/webStatic/downloads/22.mp3"
        });
      },
      supplied: "mp3"
    })

})


function PlaySound() {
    $("#jplayer").jPlayer('play');
    return true;
}

function NewsComing(idused){
$.post("newscome", {"idused":idused},function(data){


    data = JSON.parse(data)
    if (data["status"]!="no")
        {
        idused=data["idnow"]
        result=data["result"]
        if(result!=0)
            {
            showMsgNotification("订单消息","您有"+result+"个订单需要处理")
            PlaySound()
            }
        }
    else
        {
        idused=data["idnow"]
         }

  setInterval(NewsComing(idused),1000);

 })

}


function showMsgNotification(title, msg){
//声明一个对象
var Notification = window.Notification || window.mozNotification || window.webkitNotification;
//alert(Notification.permission ) 查看是否授权
//如果授权
if (Notification && Notification.permission === "granted")
{
    var instance = new Notification( title,{body: msg, icon: "/webStatic/downloads/news.PNG", tag: 'same'});

//        instance.tag="same";
        instance.onclick = function () {
        // Something to do
        };
//        instance.onerror = function () {
//        // Something to do
//        };
        instance.onshow = function () {
        // Something to do
        // console.log(instance.close);
        setTimeout(instance.close, 3000);
        };
//        instance.onclose = function () {
//        // Something to do
//        };
}
//没有授权

else if(Notification && Notification.permission !== "denied")
{
    //requestPermission()方法来请求用户权限 基本上就用一次
    Notification.requestPermission(
      function (status) {
        if (Notification.permission !== status)
         {
            Notification.permission = status;
          }
        // If the user said okay
        if (status === "granted") {
            var instance = new Notification(title, {body: msg,icon: "/webStatic/downloads/news.PNG",tag: 'same'});

            instance.tag="same";

            instance.onclick = function () {
            // Something to do
            };
            instance.onerror = function () {
            // Something to do
            };
            instance.onshow = function () {
            // Something to do
            setTimeout(instance.close, 3000);
            };
            instance.onclose = function () {
            // Something to do
            };

        }
        //If the user didn't say okay
        else
        {
        return false
        }
    });
}
//其他
else
{
return false;
}

}