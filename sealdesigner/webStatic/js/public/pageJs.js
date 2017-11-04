/*
后台管理中心分页js
传入参数为：dataCount信息总条数，showNum每页显示的信息条数
需要获取的参数 $.cookie("page") 当前的页数。
部分样式引用bootstrap.css 和 bootstrap.min.css
需要重置当前页的样式  .nowPage{color:#000000;font-size:15px;font-weight:bold;} （将此段css复制到样式表中）
案例参考关联代码：templates/Seal/first/index.html   webStatic/css/admin/stylesheets/index.css  webStatic/js/admin/first/index.js  Seal/indexData.py
王志文
2016/1/17
*/

function pageJs(dataCount,showNum){
    pageTote= (dataCount%showNum == 0)?parseInt((dataCount/showNum)):(parseInt(dataCount/showNum)+1);
    var str = "";

    str += "<li><a>共"+pageTote+"页</a></li>";
    nowPage=parseInt($.cookie("page"));
    if(nowPage!=1&&pageTote>=4){  //第一页
        str +="<li style='width: auto;'><a class='first' href='javascript:void(0)'>First</a></li>";
    }
    if(nowPage>1&&pageTote>=4){
        str += "<li><a class='pageUp' href='javascript:;'> <<<</a></li>";
    }
    if(pageTote<=4){
        for(i=1;i<pageTote+1;i++){
            if (i==nowPage){
                str+="<li><a class='pageNum nowPage'  href='javascript:;'>"+i+"</a></li>";
            }else{
                str+="<li><a class='pageNum' href='javascript:;'>"+i+"</a></li>";
            }
        }
    }else{
        if(nowPage<4){
            for(var i=1;i<=4;i++){
                if (i==nowPage){str+="<li><a class='pageNum nowPage'  href='javascript:;'>"+i+"</a></li>";}
                else{ str+="<li><a class='pageNum' href='javascript:;'>"+i+"</a></li>";}
            }
//            str+="<li><a class='morePage' href='javascript:;'> ... </a></li>"
        }
        else if (nowPage+1<=pageTote){
//            str+="<li><a class='morePage' href='javascript:;'> ... </a></li>"
            for(var i=nowPage-2;i<=nowPage+1;i++){
                if (i==nowPage){str+="<li><a class='pageNum nowPage'  href='javascript:;'>"+i+"</a></li>";}
                else{ str+="<li><a class='pageNum' href='javascript:;'>"+i+"</a></li>";}
            }
//            str+="<li><a class='morePage' href='javascript:;'> ... </a></li>"
        }
        else{
//            str+="<li><a class='morePage' href='javascript:;'> ... </a></li>"
            for(var i=nowPage-3;i<=pageTote;i++){
                if (i==nowPage){str+="<li><a class='pageNum nowPage'  href='javascript:;'>"+i+"</a></li>";}
                else{ str+="<li><a class='pageNum' href='javascript:;'>"+i+"</a></li>";}
            }
        }
    }
    //跳转输入文本和按钮
//    str+="<span><a><input type='text' class='gotoPageNum' style='width:40px;height:29px;margin:0px 3px;' value='1'></a></li></span><span><a><input class='gotoPage' type='button' value='跳转' style='margin-top:-1px;width:55px;height:35px;'/></a></span>"
    if (nowPage<pageTote&&pageTote>=4){
        str += "<li><a class='pageDown' href='javascript:;'> >>> </a></li>";
    }
    if(nowPage!=pageTote&&pageTote>=4){  //最后一页
        str +="<li style='width: auto;'><a class='Last' href='javascript:void(0)'>Last</a></li>";
    }
    if(pageTote>=3){
    /*设置输入框只能输入数字*/
    str += "<span><a><input class='gotoPageNum' placeholder='跳转页' onkeyup="
    str += "this.value=this.value.replace(/[^0-9]/g,'') onafterpaste="
    str += "this.value=this.value.replace(/[^0-9]/g,'')"
    str += "type='text' style='width: 45px;margin-left: 20px;height: 34px;'></a></li></span>"
    str += "<span><a><input class='gotoPage' style='height: 40px;border-radius: 0 3px 3px 0px;color: cornflowerblue;border: 1px #cbcbcb solid;' type='button' value='Search'/></a></span>"
            }


    $(".pagination").css("width","90%")
    return str;

}


