/**
 * Created by smart on 2017/10/23.
 */

ue.addListener("ready", function () {
    ue.setContent($("#informationContent").val());

    $("body").on("click", ".btn", function () {

        var changeId = $("#changeId").val();
        var title = $("#title").val();
        var newsType = $("input[name='newsType']:checked").val();
        var link = $("#link").val();
        var status = $("input[name='status']:checked").val();
        var content = ue.getContent();
        $.post("/Seal/addNews", {changeId: changeId, title: title, newsType: newsType, link: link, status: status, content: ue.getContent()}, function (data) {
            if(data = 1){
                alert("保存成功！");
                window.location.reload();
            }
            else {
                alert("保存失败，请重试");
            }

            })
        })
    })



function getAdminName() {
    $.post("/Seal/getAdminName", function (data) {
        var str = data;
        $("#adminName").append(str);
    })
}