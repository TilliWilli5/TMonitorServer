var CBase = require("./CBase.js");
const db = require("./CDatabaseBroker.js");
function CAuth(pCore)
{
    this.Initialize(pCore);
};
CAuth.prototype = Object.create(CBase.prototype);
CAuth.prototype.constructor = CAuth;
module.exports = CAuth;
CAuth.core = {};
//
//
CAuth.checkUserSessionID = function(pUSID)
{
    if(pUSID)
        return true;
    else
        return false;
};
CAuth.LoadUserInfo = function(pID)
{
    
};
CAuth.VerifyUser = function(pReq, pCallback)
{
    var _result = {};
    _result.isAuthorized = false;
    if(pReq.cookies.userSessionID)
    {
        db.GetUserInfoByUSID(pReq.cookies.userSessionID, (pErrors, pRows)=>{
                if(pRows.length === 0)
                {
                    pCallback(_result);
                }
                else
                {
                    for(var field in pRows[0])
                    {
                        _result[field] = pRows[0][field];
                    }
                        _result.isAuthorized = true;
                        pCallback(_result);
                }
        });
    }
    else
    {
        if(pReq.method.toUpperCase() === "POST")
        {
            if(pReq.body.auth)
            {
                var login = pReq.body.auth.login;
                var password = pReq.body.auth.password;
                db.GetUserInfoByLogPass(login, password, (pErrors, pRows)=>{
                    if(pRows.length === 0)
                    {
                        pCallback(_result);
                    }
                    else
                    {
                        for(var field in pRows[0])
                        {
                            _result[field] = pRows[0][field];
                            _result.isAuthorized = true;
                            pCallback(_result);
                        }
                    }
                });
            }
            else
            {
                pCallback(_result);
            }
        }
        else
        {
            pCallback(_result);
        }
    }
};