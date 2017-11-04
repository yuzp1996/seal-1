//fileId未<input type=file >的id  函数返回的值就是图片的url    用  $("图片id或class") .attr("src",getFileUrl(fileId))
//从本地获取input[file]图片的url Important
	function getFileUrl(fileId) {
		var url;
		var file = document.getElementById(fileId);
		var agent = navigator.userAgent;
		if (agent.indexOf("MSIE")>=1) {
		url = file.value;
		} else if(agent.indexOf("Firefox")>0) {
		url = window.URL.createObjectURL(file.files.item(0));
		} else if(agent.indexOf("Chrome")>0) {
		url = window.URL.createObjectURL(file.files.item(0));
		}
		return url;
	}
