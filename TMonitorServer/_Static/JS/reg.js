$(document).ready(function(){
    $("#theSubmitButton").click(function(){
        // 
        //Проверяем валидность полей
        if($("#theRegForm")[0].checkValidity() === true)
        {
            var formData = $("#theRegForm").serializeArray();
            var data = {};
            for(var kvp in formData)
            {
                data[kvp.name] = kvp.value; 
            }
            // $.getJSON("/reg", data, RegResponseHandler);
            $.ajax({
               method:"POST",
               url:"/reg",
               data:JSON.stringify(data),
               contentType:"application/json" 
            }).done(RegResponseHandler);
        }
        else
        {
            CheckFormsFields();
        }
    });
});
function RegResponseHandler(pData)
{
    console.log(pData);
};
function CheckFormsFields()
{
    $("input").each(function(){
        if(this.checkValidity() === false)
        {
            $(this).parent().removeClass("has-success").addClass("has-error");
            $(this).next().removeClass("glyphicon-ok").addClass("glyphicon-remove");
            
            // $(this).parent().addClass("has-error");
            // $(this).next().addClass("glyphicon-remove");
        }
        else
        {
            $(this).parent().removeClass("has-error").addClass("has-success");
            $(this).next().removeClass("glyphicon-remove").addClass("glyphicon-ok");
            
            // $(this).parent().addClass("has-success");
            // $(this).next().addClass("glyphicon-ok");
        }
    });
};