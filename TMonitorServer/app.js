var config = require("./cConfigurator.js");

var express = require('express');
var app = express();

const fs = require('fs');
var counter = 0;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const theParser = require("./cTelemetryParser.js");

app.get('/', function (req, res) {
	res.status(200);
	res.send('alright');
});
app.post(config.telemetryDC, function (req, res) {
	theParser.Parse(req, res);
});
app.listen(config.port, function () {
  console.log('The server is running on port: ' + config.port);
});
var timeStart = new Date();
process.on("SIGINT", function(){
	var timeEnd = new Date();
	var log = "[Server time start]: " + timeStart.toLocaleString() + "\n[Server shutdown time]: " + timeEnd.toLocaleString() + "\n[Quantity of request]: " + counter;
	console.log(log);
	//fs.writeFile("log file.txt", log);
	process.exit();
});