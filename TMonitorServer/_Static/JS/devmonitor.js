$(document).ready(function(){
    // var sse = new EventSource("http://95.213.151.109/devmonitor");
    var sse = new EventSource(`http://${general.serverIP}/devmonitor/messages`);
    sse.onmessage = function(pEvent)
    {
        console.log("New message has arrived");
        // console.log(JSON.parse(pEvent.data));
        NewDataHandler(JSON.parse(pEvent.data));
    };
    sse.onerror = function(pError)
    {
        console.error("Error with sse");
    }
});
function NewDataHandler(pData)
{
    //Проверяем текущий токен и отсеиваем все лишнее
    var token = $("#tokenInput").val();
    if(JSON.parse(pData.signature).installationToken !== token)
        return;
    var count = $("#messageBox").children().length;
    var head = "";
    var body = "";
    if(pData.message==="checkToken" || pData.message === "ping")
    {
        head = `[${pData.tick}] ${pData.message}`;
        body = pData.sendingTime;
    }
    else
    {
        head = `[${pData.tick}] Telemetry`;
        body = pData.message;
    }
    var template = `<div id="panel${count}" class="panel panel-info">
                    <div class="panel-heading"  data-toggle="collapse" data-target="#panelBody${count}">${head}</div>
                    <div id="panelBody${count}" class="panel-collapse collapse">
                        <div class="panel-body">${body}</div>
                    </div>
                </div>`;
    if(count === 0)
    {
        $("#messageBox").append(template);
    }
    else
    {
        $(template).insertBefore($("#messageBox").children()[0]);
    }
    // console.log(pData);
};