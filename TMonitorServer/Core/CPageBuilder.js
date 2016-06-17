var CBase = require("./CBase.js");
var auth = require("./CAuth.js");
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
            pRes.render("auth.html");
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
                db.CheckUserExists();
                var response = {};
                response.success = false;
                response.error = "login exists";
                response.errorID = 5;
                pRes.send(JSON.stringify(response));
            }
            else
            {
                pRes.render("reg.html");
            }
        }
    });
};