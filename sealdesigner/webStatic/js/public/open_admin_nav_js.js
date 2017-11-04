$(function(){
    active = $(".active").html();
    $aa = $(".collapse > li > a")
    for (var i =0;i<$aa.length;i++){
        // alert($aa.eq(i).html())
       if ($aa.eq(i).html()==active){
            $aa.eq(i).parents(".collapse").addClass("in")
            break;
        }
    }
})