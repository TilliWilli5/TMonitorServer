var CConfig = require("./Core/CConfig.js");
var config = new CConfig();
config.LoadFromFile("./Core/Configs/webConf.json");

var express = require('express');
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
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
//Address like http://127.0.0.1/dashboard
app.get(config.webDashboard, function (req, res) {
	pb.DashboardHandler(req, res);
});
app.post(config.webDashboard, function (req, res) {
	pb.DashboardHandler(req, res);
});
//Address like http://127.0.0.1/devmonitor
app.get(config.webDevMonitor, function (req, res) {
	pb.DevMonitorHandler(req, res);
});
app.post(config.webDevMonitor, function (req, res) {
	pb.DevMonitorHandler(req, res);
});
//Address like http://127.0.0.1/devmonitor/messagesevents
app.get(config.webDevMonitorEvents, function (req, res) {
	pb.DevMonitorEventsHandler(req, res, gSSE);
});
app.post(config.webDevMonitorEvents, function (req, res) {
	pb.DevMonitorEventsHandler(req, res, gSSE);
});
//Test sse http://127.0.0.1/sse
var gSSE = {};
gSSE.responseStream = null;
gSSE.RegisterResponseStream = function(pRes){this.responseStream = pRes;};
gSSE.GetResponse = function(){return this.responseStream;};
module.exports = gSSE;
app.get("/sse", function (req, res) {
	pb.SSEHandler(req, res, gSSE);
});
//Address like http://127.0.0.1/projectsInfo
app.get(config.webProjectsInfo, pb.ProjectsInfoHandler);
app.post(config.webProjectsInfo, pb.ProjectsInfoHandler);
//Address like http://127.0.0.1/about
app.get(config.webAbout, pb.AboutHandler);
app.post(config.webAbout, pb.AboutHandler);
//Address like http://127.0.0.1/replicationDB
app.get(config.webReplicationDB, pb.ReplicationDatabaseHandler);
app.post(config.webReplicationDB, pb.ReplicationDatabaseHandler);
//Должно оставаться последним
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