var CBase = require("./CBase.js");
var auth = require("./CAuth.js");
const db = require("./CDatabaseBroker.js");
var CSC = require("./CStatCalculator.js");
var calculator = new CSC();
var CConfig = require("./CConfig.js");
var tmConf = new CConfig();
tmConf.LoadFromFile("./Core/Configs/telemetry.json");
function CPageBuilder(pCore)
{
    this.Initialize(pCore);
};
CPageBuilder.prototype = Object.create(CBase.prototype);
CPageBuilder.prototype.constructor = CPageBuilder;
module.exports = CPageBuilder;
CPageBuilder.core = {};
//
//
CPageBuilder.RootHandler = function(pReq, pRes)
{
    auth.VerifyUser(pReq, (pUserInfo)=>{
        if(pUserInfo.isAuthorized)
        {
            pRes.redirect("/dashboard");
        }
        else
        {
            pRes.redirect("/auth");
        }
    });
};
CPageBuilder.AuthHandler = function(pReq, pRes)
{
    auth.VerifyUser(pReq, (pUserInfo)=>{
        if(pUserInfo.isAuthorized)
        {
            pRes.redirect("/dashboard");
        }
        else
        {
            if(pReq.method.toUpperCase() === "POST")
            {
                var response = {};
                db.GetUserInfoByLogPass(pReq.body.login, pReq.body.password, (pErrors, pRows)=>{
                    if(pRows.length === 0)
                    {
                        response.isSuccess = false;
                        response.message = "login doesn't exist";
                        response.errorID = 1;
                        pRes.send(JSON.stringify(response));
                    }
                    else
                    {
                        var now = new Date();
                        var rememberPeriod = 1000*60*60*24;
                        var expires = new Date(now.getTime() + rememberPeriod);
                        var usid = db.CreateUserSession(pRows[0].rowid, expires.toISOString());
                        if(pReq.body.remember)
                        {
                            pRes.setHeader('Set-Cookie', [`userSessionID=${usid}; expires=${expires.toISOString()}; path="/"`]);
                        }
                        else
                        {
                            pRes.setHeader('Set-Cookie', [`userSessionID=${usid}; expires=0; path="/"`]);
                        }
                        response.isSuccess = true;
                        response.message = "Success auth";
                        // response.newUSID = usid;
                        pRes.send(JSON.stringify(response));
                        // pRes.redirect("/dashboard");
                    }
                });
            }
            else
            {
                pRes.render("auth.html");
            }
        }
    });
};
CPageBuilder.RegHandler = function(pReq, pRes)
{
    auth.VerifyUser(pReq, (pUserInfo)=>{
        if(pUserInfo.isAuthorized)
        {
            pRes.redirect("/dashboard");
        }
        else
        {
            if(pReq.method.toUpperCase() === "POST")
            {
                var response = {};
                db.CheckUserExists(pReq.body.login, (pResult)=>{
                    if(!pResult)
                    {
                        response.isSuccess = false;
                        response.message = "login exists";
                        response.errorID = 1;
                        pRes.send(JSON.stringify(response));
                    }
                    else
                    {
                        db.CreateUserAccount(pReq.body.login, pReq.body.password, pReq.body.email);
                        response.isSuccess = true;
                        response.message = "New login created";
                        pRes.send(JSON.stringify(response));
                    }
                });
            }
            else
            {
                pRes.render("reg.html");
            }
        }
    });
};
CPageBuilder.DashboardHandler = function(pReq, pRes)
{
    auth.VerifyUser(pReq, (pUserInfo)=>{
        if(pUserInfo.isAuthorized)
        {
            var projectAccessField = pUserInfo["project_access_field"].split(" ");
            var data2client = {};
            calculator.CalcTelemetryStat(null, AfterCalc);
            function AfterCalc(pRows)
            {
                if(pRows === 0)
                {
                    pRes.render("dashboard.html", {data2client:`var data={userInfo:null, telemetryData:null}`});
                }
                else
                {
                    data2client.userInfo = pUserInfo;
                    data2client.telemetryData = pRows;
                    var teleMetaData = [];
                    //Filter projects available to current user
                    for(var iX=0; iX<tmConf.projects.length; ++iX)
                    {
                        if( (projectAccessField.indexOf((iX+1).toString())) === -1)
                        {
                            continue;
                        }
                        else
                        {
                            teleMetaData.push(tmConf.projects[iX]);
                        }
                    }
                    data2client.telemetryConf = teleMetaData;
                    data2client = JSON.stringify(data2client);
                    pRes.render("dashboard.html", {data2client:`var data = ${data2client};`});
                    // pRes.render("dashboard.html", {data2client:JSON.stringify(data2client)});
                }
            };
        }
        else
        {
            pRes.redirect("/");
        }
    });
};
CPageBuilder.DevMonitorHandler = function(pReq, pRes)
{
    pRes.render("devmonitor.html");
};
CPageBuilder.DevMonitorEventsHandler = function(pReq, pRes, pGSSE)
{
    pRes.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
    });
    pRes.write("\n");
    pGSSE.RegisterResponseStream(pRes);
    // pRes.write(`data: {"username": "bobby", "time": "02:33:48"}\n`);
    // pRes.write(`retry: 1000\n`);
    // pRes.end();
};
CPageBuilder.SSEHandler = function(pReq, pRes, pGSSE)
{
    pGSSE.GetResponse().write(`data: {"username": "bobby", "time": "02:33:48"}\n\n`);
    pRes.end("ok");
    // pGSSE.GetResponse().write(`retry: 1000\n\n`);
};
CPageBuilder.ProjectsInfoHandler = function(pReq, pRes)
{
    auth.VerifyUser(pReq, (pUserInfo)=>{
        if(pUserInfo.isAuthorized)
        {
            var projectAccessField = pUserInfo["project_access_field"].split(" ");
            db.RetrieveProjectsInfo(AfterRetrieve);
            function AfterRetrieve(pRows)
            {
                var projectsInfo = {};
                for(var iX=0; iX<pRows.length; ++iX)
                {
                    //Исключаем проекты к кым у юзера нету доступа
                    if(projectAccessField.indexOf(pRows[iX]["project_id"].toString()) === -1)
                        continue;
                    //
                    if(!projectsInfo[pRows[iX]["ticket"]])
                        projectsInfo[pRows[iX]["ticket"]] = [];
                    //Assign status
                    AssignInstaStatus(pRows[iX]);
                    projectsInfo[pRows[iX]["ticket"]].push(pRows[iX])
                    // projectsInfo.push(pRows[iX]);
                }
                
                pRes.end(JSON.stringify(projectsInfo));
            };
        }
        else
        {
            pRes.redirect("/");
        }
    });
    function AssignInstaStatus(pInstaInfo)
    {
        var oneMinute = 60*1000;//60 секундый интервал
        pInstaInfo.status = "active";
        pInstaInfo.outdated = "normal";
        var lastPing = (new Date(pInstaInfo["last_update"])).getTime();
        var lastQuit = (new Date(pInstaInfo["last_quit"])).getTime();
        // if(pInstaInfo["last_quit"] === 0)
        // {
        //     pInstaInfo.status = "active";
        // }
        if(lastQuit > lastPing)
        {
            pInstaInfo.status = "stopped";
        }
        if(Date.now() - lastPing > 5*oneMinute)
        {
            pInstaInfo.outdated = "notbad";
            if(Date.now() - lastPing > 15*oneMinute)
            {
                pInstaInfo.outdated = "outdated";
                pInstaInfo.status = "stopped";
            }
        }
    }
};
CPageBuilder.AboutHandler = function(pReq, pRes)
{
    require("./AboutGitVersion.js")((pVersionInfo)=>{
        pRes.render("about.html", {GitVersionLog:pVersionInfo});
    });
};