var CBase = require("./CBase.js");
const fs = require("fs");
//
//Объявление класса
//
function CLog(pCore)
{
    this.text = "";
    this.fileName = "";
    this.Initialize(pCore);
};
//Наследование
CLog.prototype = Object.create(CBase.prototype);
CLog.prototype.constructor = CLog;
CLog.core = {};
CLog.core.isDefault = true;
CLog.core.fileName = "log.txt";
module.exports = CLog;
//Расширение класса
CLog.prototype.Write = function(pMessage)
{
    this.text += pMessage.toString();
};
CLog.prototype.WriteLine = function(pMessage)
{
    this.text += pMessage.toString() + "\n";
};
CLog.prototype.WriteT = function(pMessage)
{
    var date = new Date();
    this.text += `[${date.toISOString()}]: ${pMessage}`;
};
CLog.prototype.WriteLineT = function(pMessage)
{
    var date = new Date();
    this.text += `[${date.toISOString()}]: ${pMessage}\n`;
};
CLog.prototype.WriteLineTT = function(pMessage, pPoint)
{
    var date = new Date();
    this.text += `[${date.toISOString()}][${pPoint}]: ${pMessage}\n`;
};
CLog.prototype.Info = function(pMessage)
{
    this.WriteLineTT(pMessage, "Info");
};
CLog.prototype.Warn = function(pMessage)
{
    this.WriteLineTT(pMessage, "Warn");
};
CLog.prototype.Error = function(pMessage)
{
    this.WriteLineTT(pMessage, "Error");
};
CLog.prototype.Show = function()
{
    return this.text;
};
CLog.prototype.SaveToFile = function(pFileName)
{
    fs.writeFile(pFileName || this.fileName, this.text);
};
CLog.prototype.Clear = function()
{
    this.text = "";
};