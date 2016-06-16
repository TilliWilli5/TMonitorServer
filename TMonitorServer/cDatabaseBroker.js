//Настройки
var databaseName = "db/tm";

//Дальше
const sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(databaseName);

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