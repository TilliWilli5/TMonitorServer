$(document).ready(function(){
    //$("#projectsScreen").hide();
    $("#installationsScreen").hide();
    $("#statsScreen").hide();
    //Инициализируем виджет с календарями
    $('#datetimepicker1').datetimepicker({language: 'ru', pickTime: false}).on("change", ShowStats);
    //VisProjectsScreen(data.telemetryConf);
    VisDashboardHeader(data.telemetryConf);
});

function VisProjectsScreen(pProjectsInfo)
{
    pProjectsInfo.forEach((pProject)=>{
        var projectName = pProject.label;
        var instaCount = pProject.installations.length;
        var template = `<button type="button" class="btn btn-primary" style="cursor:pointer;" onclick="GotoInstallationsScreen();">${projectName} <span class="badge">${instaCount}</span></button>`;
        $("#projectsScreen div").empty();
        $("#projectsScreen div").append(template);
        console.log("each");
    });
    
};
function GotoInstallationsScreen()
{
    $("#projectsScreen").hide();
    $("#statsScreen").hide();
    $("#installationsScreen").show();
};
function VisDashboardHeader(pProjectsInfo)
{
    pProjectsInfo.forEach((pProject)=>{
        var projectName = pProject.label;
        var instaCount = pProject.installations.length;
        var projectTemplate = `<li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">${projectName} <span class="badge">${instaCount}</span><span class="caret"></span></a>`;
            var instaList = `<ul class="dropdown-menu">`;
            for(var iX=0; iX<instaCount; ++iX)
            {
                instaName = pProject.installations[iX].label;
                instaList += `<li><a href="javascript:void(0);" onclick="GotoStatsScreen(this);">${instaName}</a></li>`;
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
    var currentProjectIndex = Array.prototype.indexOf.call(pTarget.parentNode.parentNode.parentNode.children, pTarget.parentNode.parentNode);
    window.current = {};
    window.current.project = currentProjectIndex - 1;
    window.current.installation = currentInstallationIndex;
    var buttonGroups = [];
    var curTelemetryStructure = data.telemetryConf[current.project].installations[current.installation].telemetry;
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
    
};