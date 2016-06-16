var CBase = require("./CBase.js");
const fs = require("fs");

function CConfig(pCore)
{
    this.$ = {};
    this.Initialize(pCore);
};
CConfig.prototype = Object.create(CBase.prototype);
CConfig.prototype.constructor = CConfig;
module.exports = CConfig;
CConfig.core = {};
CBase.core.isDefault = true;
//
CConfig.prototype.LoadFromFile = function(pFileName)
{
    Object.assign(this, JSON.parse(fs.readFileSync(pFileName)));
};