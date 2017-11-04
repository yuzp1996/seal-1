ue.addListener("ready", function () {
    // var ue = new UE.ui.Editor();
    // ue.render('content');
    // ue.addListener("ready", function () {
    //     ue.setContent($("#informationContent").val());
    //     console.log(ue.getContent())
    //
    // })
    // getAdminName();

    ue.setContent($("#informationContent").val());



    $("body").on("click", ".btn", function () {
    var informationId = $("#informationId").val();
    $.post("/Seal/SaveChange", {informationId: informationId, informationContent: ue.getContent()}, function (data) {
            alert(data);
            console.log(window.location.href);
            // window.location.href="http://bing.com";
            window.history.back(-1);
        })
    })

    //console.log(content);
})

function getAdminName() {
    $.post("/Seal/getAdminName", function (data) {
        var str = data;
        $("#adminName").append(str);
    })
}


// $("body").on("click", ".btn", function () {
//     console.log("click");
//     var informationId = $("#informationId").val();
//     console.log(informationId);
//     ue.addListener("ready", function () {
//         var content = ue.getContent();
//         console.log(content);
//         $.post("/Seal/SaveChange", {informationId: informationId, informationContent: content}, function (data) {
//             alert(data);
//         })
//     })

    //console.log(content);

// })