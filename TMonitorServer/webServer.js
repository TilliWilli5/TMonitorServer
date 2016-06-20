var CConfig = require("./Core/CConfig.js");
var config = new CConfig();
config.LoadFromFile("./Core/Configs/webConf.json");

var express = require('express');
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/_Static", express.static(config.staticFilesPath));

const cons = require("consolidate");
const mustache = require("mustache");
app.set("views", config.templateFolder);
// app.set("view engine", "mustache");
app.engine("html", cons.mustache);


const pb = require("./Core/CPageBuilder.js");

var cookieParser = require('cookie-parser');
app.use(cookieParser());

//Address like http://127.0.0.1
app.get(config.webSubdomain, function (req, res) {
	pb.RootHandler(req, res);
});
app.post(config.webSubdomain, function (req, res) {
	pb.RootHandler(req, res);
});
//Address like http://127.0.0.1/auth
app.get(config.webAuth, function (req, res) {
	pb.AuthHandler(req, res);
});
app.post(config.webAuth, function (req, res) {
	pb.AuthHandler(req, res);
});
//Address like http://127.0.0.1/reg
app.get(config.webReg, function (req, res) {
	pb.RegHandler(req, res);
});
app.post(config.webReg, function (req, res) {
	pb.RegHandler(req, res);
});
//Address like http://127.0.0.1/reg
app.get(config.webDashboard, function (req, res) {
	pb.DashboardHandler(req, res);
});
app.post(config.webDashboard, function (req, res) {
	pb.DashboardHandler(req, res);
});
//
app.use(function Response404(pReq, pRes, pNext){
	pRes.status(404);
	pRes.render("page404.html");
});
app.listen(config.port, function () {
  console.log('The server is running on port: ' + config.port);
});

var timeStart = new Date();
process.on("SIGINT", function(){
	var timeEnd = new Date();
	var log = "[Server time start]: " + timeStart.toLocaleString() + "\n[Server shutdown time]: " + timeEnd.toLocaleString() + "\n[Quantity of request]: ";
	console.log(log);
	process.exit();
});