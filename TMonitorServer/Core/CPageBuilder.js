var CBase = require("./CBase.js");
var auth = require("./CAuth.js");
const db = require("./CDatabaseBroker.js");
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
            pRes.render("dashboard.html");
        }
        else
        {
            pRes.redirect("/");
        }
    });
};