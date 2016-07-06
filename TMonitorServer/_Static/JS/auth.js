$(document).ready(function(){
    // alert("fck the apple");
    $("#failBox").hide();
    $("#successBox").hide();
    $("#theSubmitButton").click(function(){
        // 
        //Проверяем валидность полей
        if($("#theRegForm")[0].checkValidity() === true)
        {
            var formData = $("#theRegForm").serializeArray();
            var data = {};
            for(var kvp in formData)
            {
                data[formData[kvp].name] = formData[kvp].value; 
            }
            data.remember = $("#rememberCheckbox")[0].checked;
            // $.getJSON("/reg", data, RegResponseHandler);
            $.ajax({
               method:"POST",
               url:"/auth",
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
    var response = JSON.parse(pData);
    if(response.isSuccess)
    {
        $("#failBox").hide();
        $("#successBox").show();
        setTimeout(function(){window.location.href = "/";}, 10);
    }
    else
    {
        $("#successBox").hide();
        $("#failBox").show();
    }
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