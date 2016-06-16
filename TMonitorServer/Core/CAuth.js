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
CAuth.checkUserSessionID = function(pID)
{
    if(pID)
        return true;
    else
        return false;
};