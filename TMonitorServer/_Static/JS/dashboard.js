$(document).ready(function(){
    //$("#projectsScreen").hide();
    $("#installationsScreen").hide();
    $("#statsScreen").hide();
    //Инициализируем виджет с календарями
    $('#datetimepicker1').datetimepicker({language: 'ru', pickTime: false, defaultDate:(new Date())}).on("change", ShowStats);
    //VisProjectsScreen(data.telemetryConf);
    VisDashboardHeader(data.telemetryConf);
    UpdateProjectsStates();
    window.updateTimer = setInterval(UpdateProjectsStates, 60*1000);
});
function VisProjectsScreen(pProjectsInfo)
{
    var theTable = `<table id="projectsInfo" class="table table-hover">
                  <thead>
                     <tr> <th>#</th> <th>Installation</th> <th>Status</th> <th>Uptime</th> </tr>
                  </thead>
                 <tbody>`;
    var tBody = "";
    var id = 0;
    for(var ticket in pProjectsInfo)
    {
        tBody += `<tr><td colspan="4" style="text-align:center">${pProjectsInfo[ticket][0].projectName}</td></tr>\n`;
        for(var oneInsta of pProjectsInfo[ticket])
        {
            ++id;
            var trClass = "";
            if(oneInsta.outdated === "notbad")
                trClass = "warning";
            else if(oneInsta.outdated === "outdated")
                trClass = "danger";
            tBody += `<tr class="${trClass}"> <td>${id}</td> <td>${oneInsta.instaName}</td> <td><span class="label ${(oneInsta.status)==="active"?"label-success":"label-default"}">${oneInsta.status}</span></td> <td>${oneInsta.last_update}</td> </tr>\n`
        }
    }
    theTable += tBody;
    theTable += `                 </tbody>
               </table>
            </div>`;
    // $("#projectsScreen").empty();
    $("#projectsScreen").html(theTable);
};
function GotoProjectsScreen()
{
    $("#projectsScreen").show();
    $("#statsScreen").hide();
    $("#installationsScreen").hide();
}
function GotoInstallationsScreen()
{
    $("#projectsScreen").hide();
    $("#statsScreen").hide();
    $("#installationsScreen").show();
};
function VisDashboardHeader(pProjectsInfo)
{
    pProjectsInfo.forEach(function(pProject){
        var projectName = pProject.label;
        var instaCount = pProject.installations.length;
        var projectTemplate = `<li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">${projectName} <span class="badge">${instaCount}</span><span class="caret"></span></a>`;
            var instaList = `<ul class="dropdown-menu">`;
            for(var iX=0; iX<instaCount; ++iX)
            {
                instaName = pProject.installations[iX].label;
                instaList += `<li><a href="javascript:void(0);" onclick="GotoStatsScreen(this);ShowStats();">${instaName}</a></li>`;
            }
            instaList += `</ul>`;
        projectTemplate += instaList;
        projectTemplate += `</li>`;
        $("#instaNavigation").append(projectTemplate);
        // $("#projectsScreen div").empty();
        // $("#projectsScreen div").append(template);
        // console.log("each");
    });
};
function GotoStatsScreen(pTarget)
{
    $("#projectsScreen").hide();
    $("#installationsScreen").hide();
    $("#statsScreen").show();
    var theScreen = $("#statsScreen div")[0];

    var currentInstallationIndex = Array.prototype.indexOf.call(pTarget.parentNode.parentNode.children, pTarget.parentNode);
    var currentProjectIndex = Array.prototype.indexOf.call(pTarget.parentNode.parentNode.parentNode.parentNode.children, pTarget.parentNode.parentNode.parentNode);
    window.current = {};
    window.current.project = currentProjectIndex;
    window.current.installation = currentInstallationIndex;
    var buttonGroups = [];
    var curTelemetryStructure = data.telemetryConf[current.project].installations[current.installation].telemetry;
    window.current.telemetryStructure = curTelemetryStructure;
    for(var iX=0; iX<curTelemetryStructure.length; ++iX)
    {
        if(buttonGroups.indexOf(curTelemetryStructure[iX].buttonGroup) === -1)
            buttonGroups.push(curTelemetryStructure[iX].buttonGroup);
    }
    window.current.bgs = buttonGroups;

    console.log(current);
};
function ShowStats()
{
    console.log($('#datetimepicker1 input').val());
    $("#statsHere").empty();
    current.buttonGroup = {};
    //iX - ButtonGroup selection
    for(var iX=0; iX<current.bgs.length; ++iX)
    {
        current.buttonGroup[current.bgs[iX]] = [];
        var panelBG  = `<div class="panel panel-info">
        <div class="panel-heading">${current.bgs[iX]}</div>
        <div class="panel-body">`;

        var info = '<div class="list-group">';
        //iY - current.telemetryStructure selection
        for(var iY=0; iY<current.telemetryStructure.length; ++iY)
        {
            //Проверяем на принадлежность к данной ButtonGroup
            if(current.telemetryStructure[iY].buttonGroup !== current.bgs[iX])
                continue;
            current.buttonGroup[current.bgs[iX]][iY] = {name:current.telemetryStructure[iY].label, value:0};
            // current.buttonGroup[current.bgs[iX]].name = current.telemetryStructure[iY].label;
            // current.buttonGroup[current.bgs[iX]].value = 0;
            for(var iZ=0; iZ<data.telemetryData.length; ++iZ)
            {
                
                if(data.telemetryConf[current.project].ticket === data.telemetryData[iZ]["projects.ticket"])
                    if(data.telemetryConf[current.project].installations[current.installation].token === data.telemetryData[iZ]["tm.token"])
                    {
                        var theDate = $('#datetimepicker1 input').val();
                        theDate = theDate.split(".").reverse().join("-");
                        if(theDate === data.telemetryData[iZ]["tm.dates"])
                            if(current.telemetryStructure[iY].telemetrySignal === data.telemetryData[iZ]["tm.point"])
                            {
                                current.buttonGroup[current.bgs[iX]][iY].value = data.telemetryData[iZ]["tm.hits"];
                                break;
                            }
                    }
            }
            info += `<a href="#" class="list-group-item">${current.buttonGroup[current.bgs[iX]][iY].name}: ${current.buttonGroup[current.bgs[iX]][iY].value}</a>`;
        }
        info += '</div>';
        panelBG += info;
        //Строим график исп-уя Highcharts
            panelBG += `<div id="graph${current.bgs[iX]}" style="width:100%; height:400px;"></div>`;
        //
        panelBG += '</div>\
        </div>';
        
        $("#statsHere").append(panelBG);
        //Инициализируем график
        var cats = [];
        var dataSet = [];
        var series = [];
        for(var iW=0; iW<current.buttonGroup[current.bgs[iX]].length; ++iW)
        {
            if(current.buttonGroup[current.bgs[iX]][iW])
            {
                if(current.buttonGroup[current.bgs[iX]][iW].name.length > 20)
                    cats.push(current.buttonGroup[current.bgs[iX]][iW].name.slice(0,20) + "...");
                else
                    cats.push(current.buttonGroup[current.bgs[iX]][iW].name);
                dataSet.push(current.buttonGroup[current.bgs[iX]][iW].value);
                series.push({name:cats[cats.length-1], data:[dataSet[dataSet.length-1]]});
            }
        }
        console.log(series);
        VisChart("graph" + current.bgs[iX], cats, dataSet, series);
        //
    }
    

};
function Logout()
{
    document.cookie = `userSessionID=; expires=${new Date(0)}; path=/`;
    window.location.href = "/";
    console.log("Logout");
};
function VisChart(pElementID, pCategories, pDataSet, pSeries)
{
    $('#' + pElementID).highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Buttons hits'
        },
        xAxis: {
            categories: ['HITS']
        },
        yAxis: {
            title: {
                text: 'Hits count'
            }
        },
        series: pSeries
    });
};
function UpdateProjectsStates()
{
    $.ajax({
               method:"POST",
               url:"/projectsInfo",
               data:JSON.stringify(data),
               contentType:"application/json" 
            }).done(OnUpdateProjectsStates);
};
function OnUpdateProjectsStates(pData)
{
    data.projectsInfo = JSON.parse(pData);
    console.log(`[Update ProjectsInfo]:successfully - ${new Date().toTimeString()}`);
    VisProjectsScreen(data.projectsInfo);
};