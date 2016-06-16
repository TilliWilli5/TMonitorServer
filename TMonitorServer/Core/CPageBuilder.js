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
    if(pReq.method.toUpperCase() === "GET")
    {
        if(pReq.cookies.userSessionID)
        {
            if(auth.checkUserSessionID(1))
            {
                pRes.redirect("/dashboard");
            }
            else
            {
                pRes.render("auth.html");
            }
        }
        else
        {
            pRes.render("reg.html");
        }
        
    }
    else
    {
        
    }
};