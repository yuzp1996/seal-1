$(function(){                    //页面加载时，加载js相关函数
    $.cookie("page",1);         //默认当前页数为1
    getAdminName();             //右上角管理员信息
    materialList();          //加载材质列表
})

/* 分 页 */
$("body").on("click",".pageNum",function(){
    if ( $.cookie("page")!=$(this).html()){  //判断点击的不是当前页
            $.cookie("page",$(this).html());
    }
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));    //表中信息超过十条，换页
    materialList();
})
/*上一页*/
$("body").on("click",".pageUp",function(){
    var num = $.cookie("page");
    $.cookie("page",num-1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    materialList();
})
/*下一页*/
$("body").on("click",".pageDown",function(){
    var num = parseInt($.cookie("page"));
    $.cookie("page",num+1);
    $(".page").empty().append(pageJs($.cookie("pageCount"),10));
    materialList();
})

/*打印材质列表*/
function materialList(){
    var jsonStr = "";
    jsonStr = $.extend({},jsonStr,{"page":$.cookie("page")});
    $.post("/Seal/getMaterialList",jsonStr,function(data){              //传给getMaterialList
        var jsonData=$.parseJSON(data);
        var str="";
        for(var i in jsonData){
            str+="<tr><td>"+jsonData[i].materialQualityName+"</td><td>"+jsonData[i].isShow+"</td><td ><a class='delete' href='' data-toggle='modal' id='"+jsonData[i].materialQualityId+"','M'>删除<i class='icon-remove' title='删除'></i></a>&nbsp;&nbsp;<a class='edit' href='#modal-container-183169' data-toggle='modal' id='"+jsonData[i].materialQualityId+"'>修改<i class='icon-edit' title='修改'></a></td></tr>";
        }
        $(".stuff").empty().append(str);
        $.cookie("pageCount",jsonData[0].num);
        if (jsonData[0].num!=0){
            $(".page").empty().append(pageJs(jsonData[0].num,10));    //加载分页列表
        }
    })
}

/*按钮名称不同时调用不同函数*/
$("body").on("click",".btn-primary",function(){
    if($(this).val()=="添加"){
        addNewMaterial();
    }
    else if ($(this).val="确认修改"){
        changeMaterial();
    }
})

/*点击按钮名称变为添加*/
$("body").on("click",".addButton",function(){
    $.ajaxSetup({
          async:false                   //同步更新
        });
    $(".materialName").val("")
    $(".btn-primary").val("添加");
})

/*点击按钮名称变为删除，并获取表中信息*/
$("body").on("click",".delete",function(){
    $(".materialName").val("");
    $(".btn-primary").val("确认删除");
    var materialQualityId = $(this).attr("id");
    $(".materialQualityId").val(materialQualityId);
	$.ajaxSetup({
	  async :false                 //同步更新
	});
	if(confirm("确定要删除该条数据吗？")){
		$.post("/Seal/deleteMaterial",{"materialQualityId":materialQualityId},function(){
			if (data){
				alert("删除成功");

			}
			else{
				alert("删除失败");
			}
		})
	  }
  	else
  	{
		return false;
  	}
  	materialList();
})

/*点击按钮名称变为修改,并获取表中信息*/
$("body").on("click",".edit",function(){
    $(".materialName").val("");
    $(".btn-primary").val("确认修改");
    var materialQualityId = $(this).attr("id");
    $(".materialQualityId").val(materialQualityId);
    $.post("/Seal/getMaterial",{"materialQualityId":materialQualityId},function(data){    //传给getMaterial
        var jsonData = $.parseJSON(data);
        $(".materialName").val(jsonData[0].materialQualityName);
        if(jsonData[0].isShow){
            $("input[name='isShowRadio']:first").attr('checked', 'true');
        }else{
            $("input[name='isShowRadio']:last").attr('checked', 'true');
        }
    })
})

/*添加新的材质信息*/
function addNewMaterial(){
    var jsonStr = {};
    if($(".materialName").val()==""){
        alert("请填入材质名称");
        return ;
    }
    jsonStr=$.extend({},jsonStr,{"materialName":$(".materialName").val()},{"radioVal":$("input[name='isShowRadio']:checked").val()});
    $.post("/Seal/addNewMaterial",jsonStr,function(data){       //传给addNewMaterial
        if (data==1){
            alert("添加成功");
			$(".close").click();             //关闭添加材质窗体
			$(".materialName").val();       //清空添加材质窗体中的内容
// 			window.location.reload(true);    //页面重新加载
        }
        else if (data==0){
            alert("已存在")
        }
        else {
        	alert("添加失败")
        }
        materialList();
    })
}

/*修改材质信息*/
function changeMaterial(){
	 var materialQualityId = $(".materialQualityId").val();
     $.post("/Seal/changeMaterial",{"materialQualityId":materialQualityId,"materialName":$(".materialName").val(),"radioVal":$("input[name='isShowRadio']:checked").val()},function(data){       //传给changeMaterial
        if (data==1){
            alert("修改成功");
			$(".close").click();             //关闭添加材质窗体
	// 			window.location.reload(true);    //页面重新加载
        }
		else if (data==0){
            alert("已存在");
        }
        else{
            alert("修改失败");
        }
        materialList();
     })
}

/*获取管理员帐号，显示与右上角*/
function getAdminName(){
    $.post("/Seal/getAdminName",function(data){          //传给getAdminName
        var str=data;
        $("#adminName").append(str);
    })
}



