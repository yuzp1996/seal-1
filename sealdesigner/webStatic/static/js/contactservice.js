/*
联系客服界面js

js for customer
*/

$(function(){
//    var Post = setInterval(function(){
//        PostUserId();
//    },3000);
    PostUserId();
    GetNewMsgs();
    $("body").delegate("textarea","keydown",function(e){
        if(e.which ==13){
            //send msg button  clicked
            var msg_text = $("textarea").val();
            if($.trim(msg_text).length>0){
                 console.log(msg_text);
                 SendMsg(msg_text);
            }
            AddSentMsgIntoChatBox(msg_text);
            $("textarea").val('');

        }
    });//end body
})
function PostUserId(){
    var serviceId=$(".serviceId").attr("id");
    var userId = $(".username").attr("id");
    $.post("/chatroom/postUser/",{"serviceId":serviceId,"userId":userId},function(callback){
        console.log('num',callback);
    })
}
function AddSentMsgIntoChatBox(msg_text){
    var d = new Date();
    var send_time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    var msg_ele = "<br/><br/><div class='chat-right'><div><img src='/webStatic/static/image/user.jpg'></div>"+
    "<div class='right'><div class='name1'><span>"+send_time+"</span><b>"+$(".username").val()+"</b>"+
    "</div><div class='chat-content1'><span>"+msg_text+"</span></div></div></div>";
    $(".chat-show").append(msg_ele);
    $(".chat-show").animate({
        scrollTop:$(".chat-show")[0].scrollHeight},500);
}

function SendMsg(msg_text){
    var contact_id=$(".serviceId").attr("id");
    var username=$(".username").val();
    var userId=$(".username").attr("id");
    var msg_dic ={
        'to':contact_id,
        'from':userId,
        'from_name':username,
        'msg':msg_text
    };
    $.post("/chatroom/sendMsg/",{'data':JSON.stringify(msg_dic)},function(callback){
        console.log(callback);
    })//end post
    PostUserId();
}



function AddRecvMsgToChatBox(msg_item){
    var msg_ele ="<br/><br/><div class='chat-left'><div class='chat-img'><img src='/webStatic/static/image/admin.jpg'></div>"+
    "<div class='left'><div class='name'><b>客服</b><span >"+msg_item.timestamp+"</span>"+
    "</div><div class='chat-content'><span>"+msg_item.msg+"</span></div></div></div>";
    $(".chat-show").append(msg_ele);
    $(".chat-show").animate({
        scrollTop:$(".chat-show")[0].scrollHeight},500);
}

function GetNewMsgs(){
    var userId=$(".username").attr("id");
    $.post("/chatroom/getMsg/",{"userId":userId},function(callback){
        console.log("new_msgs"+callback);
        var msg_list = JSON.parse(callback);
        $.each(msg_list,function(index,msg_item){
            AddRecvMsgToChatBox(msg_item);
        })//end each
        //start a new request again
        GetNewMsgs();
    });//end get
}
