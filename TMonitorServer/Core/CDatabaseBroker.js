var CConfig = require("./CConfig.js");
var config = new CConfig();
config.LoadFromFile("./Core/Configs/dbConf.json");
//Настройки
var databaseName = config.databaseName;
//Дальше
const sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(databaseName);
db.exec("PRAGMA foreign_keys = ON;")
//
var uuid = require('node-uuid');
//Основной класс кый будет экспортирован
var CDatabaseBroker = {};
module.exports = CDatabaseBroker;
CDatabaseBroker.CheckInstallationToken = function (pToken, pCallback) {
	var tableName = "installations";
	var columnName = "token";
	var statement = "SELECT rowid FROM " + tableName + " WHERE token='" + pToken + "'";
	db.all(statement, function (pErrors, pRows) {
		if (pRows.length === 0)
			pCallback(false);
		else
			pCallback(true);
	});
};
CDatabaseBroker.FindInstallationIDByToken = function (pToken, pCallback) {
	var tableName = "installations";
	var columnName = "token";
	var statement = "SELECT rowid FROM " + tableName + " WHERE token='" + pToken + "'";
	db.all(statement, function (pErrors, pRows) {
		if (pRows.length === 0)
			pCallback(-1);
		else
			pCallback(pRows[0].rowid);
	});
};
CDatabaseBroker.UpdatePing = function (pID) {
	var tableName = "pings";
	var columnName = "last_update";
	var statement = `UPDATE ${tableName} SET ${columnName} = datetime('now', 'localtime') WHERE installation_id=${pID};`;
	db.exec(statement);
};
CDatabaseBroker.CheckQuitOrder = function (pID, pCallback) {
	var tableName = "orders";
	//var columnName = "name";
	//SELECT rowid FROM orders WHERE installation_id=8 AND name='quit';
	var statement = "SELECT rowid FROM " + tableName + " WHERE installation_id=" + pID + " AND name='quit'";
	db.all(statement, function (pErrors, pRows) {
		if (pRows.length === 0)
			pCallback(pID, false);
		else
			pCallback(pID, true);
	});
}
CDatabaseBroker.ClearQuitOrder = function (pID) {
	db.exec("DELETE FROM orders WHERE installation_id=" + pID);
}
CDatabaseBroker.AddTelemetry = function (pID, pNews) {
	//VALUES(pid 8, type 1, creating_time '2016-06-09T20:11:07.6242221+03:00', point 'mm.checkToken');
	var values = [];
	for (var iX = 0; iX < pNews.length; ++iX) {
		values.push("(" + pID + "," + pNews[iX].type + ",'" + pNews[iX].creatingTime + "','" + pNews[iX].point + "')");
	}
	var statement = "INSERT INTO telemetry(installation_id, type, creating_time, point) VALUES " + values.join(",");
	db.exec(statement);
};
// CDatabaseBroker.LoadTable = function(pTableName, pCallback)
// {
// 	var statement = `SELECT * FROM ${pTableName}`;
// 	db.all(statement, function(pErrors, pRows){
// 		pCallback(pErrors, pRows);
// 	});
// };
// CDatabaseBroker.FindUserByUSID = function(pUSID, pCallback)
// {
	
// };
CDatabaseBroker.CreateUserSession = function(pID, pExpired, pCallback)
{
	var tableName = "sessions(user_id, usid, expired)";
	var usid = uuid.v4();
	//settings for expire field
	var defaultTime = 1000*60*60*24;//one day
	var expiredTime = new Date((new Date()).getTime() + defaultTime);//Текущий момент + один день
	var statement = `INSERT INTO ${tableName} VALUES(${pID}, "${usid}", "${pExpired}")`;
	db.exec(statement);
	return usid;
};
CDatabaseBroker.DeleteUserSession = function(pID)
{
	var statement = `DELETE FROM sessions WHERE user_id=${pID}`;
	db.exec(statement);
};
CDatabaseBroker.Exec = function(pStatement)
{
	db.exec(pStatement);
};
CDatabaseBroker.GetUserInfoByUSID = function(pUSID, pCallback)
{
	var statement = `SELECT  users.rowid,  users.login,  users.password,  users.privilege,  users.created,  users.project_access_field,  sessions.usid,  sessions.created,  sessions.expired FROM  users JOIN sessions ON  users.rowid=sessions.user_id  AND  sessions.usid="${pUSID}"`;
	db.all(statement, (pErrors, pRows)=>{
		pCallback(pErrors, pRows);
	});
};
CDatabaseBroker.GetUserInfoByLogPass = function(pLogin, pPassword, pCallback)
{
	var statement = `SELECT * FROM users WHERE login="${pLogin}" AND password="${pPassword}"`;
	db.all(statement, (pErrors, pRows)=>{
		pCallback(pErrors, pRows);
	});
};
CDatabaseBroker.CheckUserExists = function(pLogin, pCallback)
{
	var statement = `SELECT * FROM users WHERE login="${pLogin}"`;
	db.all(statement, (pErrors, pRows)=>{
		pCallback(pRows.length === 0);
		// if(pRows.length === 0)
		// {
		// 	pCallback(false);
		// }
		// else
		// {
		// 	pCallback(true);
		// }
	});
};
CDatabaseBroker.CreateUserAccount = function(pLogin, pPassword, pEmail)
{
	var statement = `INSERT INTO users(login, password, email, privilege) VALUES ("${pLogin}","${pPassword}","${pEmail}","user")`;
	db.exec(statement);
};
CDatabaseBroker.TryAuth = function(pLogin, pPassword, pCallback)
{
	var statement = `SELECT * FROM users WHERE login="${pLogin}" AND password="${pPassword}"`;
	db.all(statement, (pErrors, pRows)=>{
		pCallback(pRows.length === 0);
	});
};
CDatabaseBroker.RetrieveTelemetryStat = function(pOptions, pCallback)
{
	var statement = `SELECT projects.rowid, projects.name, projects.ticket, tm.name, tm.token, tm.project_id, tm.hits, tm.dates, tm.installation_id, tm.type, tm.point, tm.ping FROM projects JOIN ( SELECT installations.name, installations.token, project_id, tm.hits, tm.dates, tm.installation_id, tm.type, tm.point, tm.ping FROM installations JOIN ( SELECT COUNT(point) AS hits, date(creating_time) as dates, telemetry.installation_id, type, point, last_update AS ping FROM telemetry JOIN pings ON telemetry.installation_id = pings.installation_id WHERE type != 14 GROUP BY dates, telemetry.installation_id, type, point ) AS tm ON installations.rowid = tm.installation_id ) AS tm ON tm.project_id = projects.rowid;`;
	db.all(statement, (pErrors, pRows)=>{
		pCallback(pRows);
	});
};