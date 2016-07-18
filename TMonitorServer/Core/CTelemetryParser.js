const db = require("./CDatabaseBroker.js");


var CTelemetryParser = {};
CTelemetryParser.Parse = function (pReq, pRes) {
	console.log("============================================================================");
	console.dir(pReq.body);
	console.log("\n");
	switch (pReq.body.message) {
		case "checkToken": this.DispatchCheckToken(pReq, pRes); break;
		case "ping": this.DispatchPing(pReq, pRes); break;
		default: this.DispatchTelemetry(pReq, pRes); break;
	}
}
CTelemetryParser.DispatchCheckToken = function (pReq, pRes) {
	var signature = JSON.parse(pReq.body.signature);
	db.CheckInstallationToken(signature.installationToken, function (pResult) {
		if (pResult) {
			console.log("[Response]:")
			console.log("valid");
			pRes.send("valid");
		}
		else {
			console.log("[Response]:")
			console.log("invalid");
			pRes.send("invalid");
		}
	});
}
CTelemetryParser.DispatchPing = function (pReq, pRes) {
	var signature = JSON.parse(pReq.body.signature);
	db.FindInstallationIDByToken(signature.installationToken, function (pID) { 
		if (pID === -1) {
			console.log("[Response]:")
			console.log("invalid token");
			pRes.send("invalid token");
		}
		else {
			db.UpdatePing(pID);
			db.CheckQuitOrder(pID, function (pID, pOrderExist) {
				if (pOrderExist) {
					db.ClearQuitOrder(pID);
					console.log("[Response]:")
					console.log("{\"order\":\"quit\"}");
					pRes.send("{\"order\":\"quit\"}");
				}
				else {
					console.log("[Response]:")
					console.log("pong");
					pRes.send("pong");
				}
			});
			//console.log("[Response]:")
			//console.log("pong");
			//pRes.send("pong");
		}
	});
	//throw new Error("no implementation");
}
CTelemetryParser.DispatchTelemetry = function (pReq, pRes) {
	var signature = JSON.parse(pReq.body.signature);
	// var fs = require("fs");
	// fs.writeFileSync("messageObject.txt", pReq.body.message);
	var messageObject = JSON.parse(pReq.body.message.replace(",,",",").replace(",,",","));//Иногда могут встречаться неправильно составленные логи с 2 запятыми подряд - этот костыль для исправления !!!! но впоследствии может приводить к багам так что надо рефакторить
	var news = this.FilterTelemetry(messageObject);
	if (news.length === 0) {
		console.log("[Response]:")
		console.log("thx");
		pRes.send("thx");
	}
	else {
		db.FindInstallationIDByToken(signature.installationToken, function (pID) {
			if (pID === -1) {
				console.log("[Response]:")
				console.log("invalid token");
				pRes.send("invalid token");
			}
			else {
				db.AddTelemetry(pID, news);
				console.log("[Response]:")
				console.log("thx");
				pRes.send("thx");
			}
		});
	}
}
CTelemetryParser.FilterTelemetry = function (pNews) {
	//В данный момент фильтр отключен - принимаются любые сообщения
	return pNews;
	//Фильтр включен - отсеиваются WindowDressing сообщения
	// var _result = [];
	// for (var iX = 0; iX < pNews.length; ++iX) {
	// 	if (pNews[iX].type == 12)
	// 		continue;
	// 	_result.push(pNews[iX]);
	// }
	// return _result;
}
//������������ ������ ������
module.exports = CTelemetryParser;