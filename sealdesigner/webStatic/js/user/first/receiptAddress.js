$(function(){
   addSelect();//添加省份下拉列表
   addressList();//加载地址列表
})

/* 加载选择框（省份）中值*/
function addSelect(){
   $.post("/Users/optionProvince",function(data){
      var jsonData=$.parseJSON(data);
      var str="";
      for ( var i in jsonData){
         str+="<option value="+jsonData[i].provinceId+">"+jsonData[i].provinceName+"</option>";
      }
      $("#province").append(str);
   })
}
/* 所属地区 ：（省份）下拉列表值改变时，响应的加载地区下拉列表 */
$("body").on("change","#province",function(){
    uploadArea(0);
})

function uploadArea(areaId){
   var str="<option value='0'>请选择地区</option>";
   if($("#province").val()=='0'){
      $("#area").empty().append(str);
   }
   else{
   $.post("/Users/optionArea",{"provinceId":$("#province").val()},function(data){
      var jsonData=$.parseJSON(data);
      for (var i in jsonData){
         str+="<option value="+jsonData[i].areaId+">"+jsonData[i].areaName+"</option>";
      }
      $("#area").empty().append(str);
      $("#area").val(areaId);
   })
   }
}
/*打印收货地址列表*/
function addressList(){
   $.post("/Users/getAddressList",function(data){
      var jsonData=$.parseJSON(data);
      var str="";
      for (var i in jsonData){
      str+="<div class='userAddInfo'><ul><li>&nbsp;&nbsp;&nbsp;收货人：<span>"+jsonData[i].addPeople+"</span></li><li>收货地址：<span>"+jsonData[i].provinceName+"&nbsp;"+jsonData[i].areaName+"&nbsp;"+jsonData[i].addInfor+"</span></li><li>联系电话：<span>"+jsonData[i].addPhone+"</span></li>"

      if(jsonData[i].isDefault){
          str+="<li><input type='radio' name='default' checked> 默认收货地址 "
      }else{
          str+="<li>"
      }
      str+="<a href='#'class='manage'id='"+ jsonData[i].addId+"'>修改</a>&nbsp;|&nbsp;<a href=''class='delete' id='"+jsonData[i].addId +"'>删除</a></li></ul></div>"
      }
      $(".userAddInfoList").empty().append(str);
   })
}

/* 点击修改 */
$("body").on("click",".manage",function(){
    $(".btnn").val("确认修改");//将按钮改为修改
    $(".newAddress").hide();
    $("div.form-box").css("border-color","red");
    $("div.form-box").css("border-width","3px");
    $("span.item-label").html("修改收货地址")
    $(".changeAddress").show();
    var addId = $(this).attr("id");
    var str="<span class='addId' id="+addId+"></span>";//向前传所修改的收货地址的Id
    $(".receiveAddId").empty().append(str);
    $.post("/Users/getAddress",{"addId":addId},function(data){
        var jsonData = $.parseJSON(data);
        $("#province").val(jsonData[0].provinceId);
        uploadArea(jsonData[0].areaId); //直接把地区Id传给函数
        $(".addInfor").val(jsonData[0].addInfor);
        $(".addPeople").val(jsonData[0].addPeople);
        $(".addPhone").val(jsonData[0].addPhone);
        if(jsonData[0].isDefault){
            $("input[name='isDefault']:checkbox").attr('checked',true);
        }else{
            $("input[name='isDefault']:checkbox").attr('checked',false);
        }
    })
})
/*点击保存按钮或点击确认修改按钮  则保存收货地址*/
$("body").on("click",".btnn",function(){
    if($(".btnn").val()=="保存"){
        saveAddress();
    }else if($(".btnn").val()=="确认修改"){
        changeAddress();
    }
})

/* 收货地址的添加保存 */
function saveAddress(){
   var isDefault;
   if($("input[name='isDefault']").attr("checked")=="checked"){
       isDefault=1;
   }else{
       isDefault=0;
   }
   if($("#province").val()==0){
      alert("请选择省份");
      return;
   }else if($(".areaId").val()==0){
      alert("请选择地区");
      return;
   }else if($(".addInfor").val()==""){
      alert("请填入详细地址");
      return;
   }else if($(".addPeople").val()==""){
      alert("请填入收货人姓名");
      return;
   }else if($(".addPhone").val()==""){
      alert("请填入电话或手机号");
      return;
   }else if(($(".addPhone").val().length!=7)&&($(".addPhone").val().length!=11)){
      alert("号码格式不正确");
      $(".addPhone").focus();
      return;
   }else{
   $.post("/Users/shopAddresssub",{"areaId":$(".areaId").val(),"addInfor":$(".addInfor").val(),"addPeople":$(".addPeople").val(),"addPhone":$(".addPhone").val(),"isDefault":isDefault},function(data){
      if(data==1){
         window.location.reload(true);
      }else if(data==2){
         alert("收货地址已存在");
      }else{
         alert("保存失败");
      }
      addressList();
   });}
}

function changeAddress(){
   var isDefault;
   if($("input[name='isDefault']").attr("checked")=="checked"){
       isDefault=1;
   }else{
       isDefault=0;
   }
   if($("#province").val()==0){
      alert("请选择省份");
      return;
   }else if($(".areaId").val()==0){
      alert("请选择地区");
      return;
   }else if($(".addInfor").val()==""){
      alert("请填入详细地址");
      return;
   }else if($(".addPeople").val()==""){
      alert("请填入收货人姓名");
      return;
   }else if($(".addPhone").val()==""){
      alert("请填入电话或手机号");
      return;
   }else if(($(".addPhone").val().length!=7)&&($(".addPhone").val().length!=11)){
      alert("号码格式不正确");
      $(".addPhone").focus();
      return;
   }
   else{
   $.post("/Users/changeAddress",{"addId":$(".addId").attr("id"),"areaId":$(".areaId").val(),"addInfor":$(".addInfor").val(),"addPeople":$(".addPeople").val(),"addPhone":$(".addPhone").val(),"isDefault":isDefault},function(data){
        if(data=="1"){
            window.location.reload(true);
        }else{
            alert("修改失败");
        }
   });
   }
}

/*点击删除*/
$("body").on("click",".delete",function(){
    $.ajaxSetup({
	  async :false                   //同步更新
	});
	if(confirm("确定要删除该条数据吗？")){
	$.post("/Users/deleteAddress",{"addId":$(this).attr("id")},function(data){
        if(data=="1"){
            alert("删除成功");
        }else{
            alert("删除失败");
        }
	});
	}else
	{
	    return false;
	}
	addressList();
})
/* 判断输入的号码格式*/
$(".addPhone").change(function(){
    var s=$(".addPhone").val();
    if((s.length!=7)&&(s.length!=11)){
        alert("号码格式不正确");
        $(".addPhone").focus();
    }
})