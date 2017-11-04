
$("body").on("click", "#delete", function () {
    var deleteId = $("#deleteId").val()
    if(confirm("是否确定删除该新闻？？")){
        document.location.href = '/Seal/newsLists?deleteId='+deleteId;
    }
})