/*
客服首界面js
js for Customer Care
*/
$(function(){
    LoadContacts();
    GLOBAL_SESSION_CACHE={}
    OnlineUser=new Array();
//    PostServiceId();

//    var loadContactList = setInterval(function(){
//        LoadContacts();
//    },15000);
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
//载入会话列表
function LoadContacts(){
    var serviceId=$(".username").attr("id");
    $.post("/chatroom/loadContactList/",{"serviceId":serviceId},function(data){
//        console.log(callback);
        var str="";
        var jsonData = $.parseJSON(data);
        for(var i in jsonData){
            if(OnlineUser.indexOf(jsonData[i].id)==-1){
                OnlineUser.push(jsonData[i].id);
                str+="<a href='#'onclick='OpenDialogBox(this);' class='list-group-item'contact_id='"+jsonData[i].id+"' contact_type='single_contact' contact_name="+jsonData[i].name+"><div class='user'><img src='/webStatic/static/image/user.jpg' /><i>"+jsonData[i].name+"</i><span style='float:right;' class='badge'>0</span>"+"</div></a>";
            }
        }//end for
        $(".contact-list .list-group").prepend(str);
        LoadContacts();
        console.log("data",data)
    });//end post

}

//function LoadContacts(){
//    $.get("/chatroom/loadContactList",function(data){
////        console.log(callback);
//        var str="";
//        var jsonData = $.parseJSON(data);
//        for(var i in jsonData){
//            str+="<a href='#'onclick='OpenDialogBox(this);' class='list-group-item'contact_id='"+jsonData[i].id+"' contact_type='single_contact' contact_name="+jsonData[i].name+"><div class='user'><img src='/webStatic/static/image/user.jpg' /><i>"+jsonData[i].name+"</i><span style='float:right;' class='badge'>0</span>"+"</div></a>";
//        }//end for
//        $(".contact-list .list-group").empty().append(str);
//    });//end get
//}
function AddSentMsgIntoChatBox(msg_text){
    var d = new Date();
    var send_time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    var msg_ele = "<br/><br/><div class='chat-right'><div><img src='/webStatic/static/image/admin.jpg'></div>"+
    "<div class='right'><div class='name1'><span>"+send_time+"</span><b>"+$(".username").val()+"</b>"
    +"</div><div class='chat-content1'><span>"+msg_text+"</span></div></div></div>";
    $(".chat-show").append(msg_ele);
    $(".chat-show").animate({
        scrollTop:$(".chat-show")[0].scrollHeight},500);
}

function OpenDialogBox(ele){
    var contact_id = $(ele).attr("contact_id");
//    var contact_type = $(ele).attr("contact_type");
    var name=$(ele).attr("contact_name");
    //dump current session contents
    DumpSession();
    var  elem="<p><span style='color:black;' contact_id='"+contact_id+"' >您正在和"+name+"对话中</span>";
    $(".chat-header").html(elem);
    $(".chat-show").html(LoadSession(contact_id));
//    LoadSession(contact_id,contact_type);
    //clear numx
    var unread_msg_num=$(ele).find("span")[0];
    $(unread_msg_num).text(0);
    $(unread_msg_num).css("display","none");

}
function LoadSession(contact_id){
    if (GLOBAL_SESSION_CACHE.hasOwnProperty(contact_id)){
        var session_html = GLOBAL_SESSION_CACHE[contact_id];

    }else{
        var session_html='';
    }
    return session_html
}
function DumpSession(){
    var current_contact_id=$(".chat-header span").attr("contact_id")
//    var current_contact_type=$(".chat-header span").attr("contact_type")
    if(current_contact_id){
          GLOBAL_SESSION_CACHE[current_contact_id]=$(".chat-show").html();
    }
}

function DumpSession2(contact_id,content){
    if(contact_id){
          GLOBAL_SESSION_CACHE[contact_id]=content;
    }
}
function SendMsg(msg_text){
    var contact_id=$(".chat-header span").attr("contact_id");
    var servicename=$(".username").val();
    var serviceId=$(".username").attr("id");
//    alert(serviceId);
    var msg_dic ={
        'to':contact_id,
        'from':serviceId,
        'from_name':servicename,
        'msg':msg_text
    };
    $.post("/chatroom/sendMsg/",{'data':JSON.stringify(msg_dic)},function(callback){
        console.log(callback);
    })//end post
}



function AddRecvMsgToChatBox(msg_item){
    var msg_ele ="<br/><br/><div class='chat-left'><div class='chat-img'><img src='/webStatic/static/image/user.jpg'></div>"+
    "<div class='left'><div class='name'><b>"+msg_item.from_name+"</b>"+
    "<span >"+msg_item.timestamp+"</span></div><div class='chat-content'><span>"+msg_item.msg+"</span></div></div></div>";
    $(".chat-show").append(msg_ele);
    $(".chat-show").animate({
        scrollTop:$(".chat-show")[0].scrollHeight},500);
}

function GenerateNewMsgItem(msg_item){
    var msg_ele ="<br/><br/><div class='chat-left'><div class='chat-img'><img src='/webStatic/static/image/user.jpg'></div>"+
    "<div class='left'><div class='name'><b>"+msg_item.from_name+"</b>"+
    "<span >"+msg_item.timestamp+"</span></div><div class='chat-content'><span>"+msg_item.msg+"</span></div></div></div>";
    return msg_ele;
}

function UpdateUnreadMsgNums(contact_id){
    var msg_change_div=$(".contact-list a[contact_id='"+contact_id+"']");
    var msg_num_ele =$(".contact-list a[contact_id='"+contact_id+"']").find("span")[0];
    $(msg_num_ele).text(parseInt($(msg_num_ele).text())+1);
    $(".contact-list .list-group").prepend($(msg_change_div));
    $(msg_num_ele).show();
}
function GetNewMsgs(){
    $.get("/chatroom/sendMsg/",function(callback){
        console.log("new_msgs"+callback);
        console.log("hehe")

        var msg_list = JSON.parse(callback);
        var current_open_session_id=$(".chat-header span").attr("contact_id");
        $.each(msg_list,function(index,msg_item){
            if(msg_item.from==current_open_session_id){
                AddRecvMsgToChatBox(msg_item);
            }else{
                var old_session = LoadSession(msg_item.from);
                var new_msg_ele=GenerateNewMsgItem(msg_item);
                var new_session_content=old_session+new_msg_ele;
                DumpSession2(msg_item.from,new_session_content);
                UpdateUnreadMsgNums(msg_item.from);
            };
        })//end each
        //start a new request again
        GetNewMsgs();
    });//end get
}

//function PostServiceId(){
//    var serviceId=$(".serviceId").attr("id");
//    var userId = $(".username").attr("id");
//    $.post("/chatroom/postUser/",{"serviceId":serviceId,"userId":userId},function(callback){
//        console.log('num',callback);
//    })
//}