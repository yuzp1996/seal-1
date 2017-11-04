
$(document).ready(function(){
        var name = $('.barButt').eq(0).attr('id');
        if(name=="barFir"){
            document.getElementById('barFirst').style.background="#27AE60";
        }
        if(name=="barSec"){
            document.getElementById('barSecond').style.background="#27AE60";
        }
        if(name=="barThi"){
            document.getElementById('barThird').style.background="#27AE60";
        }
    });
