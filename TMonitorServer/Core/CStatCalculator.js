var CBase = require("./CBase.js");
const db = require("./CDatabaseBroker.js");
// const fs = require("fs");
var CConfig = require("./CConfig.js");
var config = new CConfig();
config.LoadFromFile("./Core/Configs/telemetry.json");
//
//Объявление класса
//
function CStatCalculator(pCore)
{
    this.shareResult;
    this.Initialize(pCore);
};
//Наследование
CStatCalculator.prototype = Object.create(CBase.prototype);
CStatCalculator.prototype.constructor = CStatCalculator;
CStatCalculator.core = {};
CStatCalculator.core.isDefault = true;
module.exports = CStatCalculator;
//Расширение
// CStatCalculator.prototype.CalcAll = function(pOptions, pFinalCallback)
// {
//     this.CalcTelemetryStat(pOptions, this);

//     // _result.telemetryStat = this.CalcTelemetryStat(config.projects);
// };
CStatCalculator.prototype.CalcTelemetryStat = function(pOptions, pCallback)
{
    db.RetrieveTelemetryStat(pOptions, pCallback);
};
// CStatCalculator.prototype.DefineLastPing = function(pOptions, pCallback)
// {
//     db.RetrievePingStat(pOptions, pCallback);
// };