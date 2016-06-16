$(document).ready(function(){
    $("#theSubmitButton").click(function(){
        // 
        //Проверяем валидность полей
        $("input").each(function(){
            if(this.checkValidity() === false)
            {
                $(this).parent().removeClass("has-success");
                $(this).next().removeClass("glyphicon-ok");
                
                $(this).parent().addClass("has-error");
                $(this).next().addClass("glyphicon-remove");
            }
            else
            {
                $(this).parent().removeClass("has-error");
                $(this).next().removeClass("glyphicon-remove");
                
                $(this).parent().addClass("has-success");
                $(this).next().addClass("glyphicon-ok");
            }
        });
    });
});