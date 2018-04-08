var fs = require("fs");
var moment = require("moment");
var svg = require("svg2img");
var Datauri = require("datauri");
var datauri = new Datauri();
var requests = require("sync-request");

module.exports = {
	init: function() {
		var usersFileName = global.DIRNAME+"/users.json";
		let users = null;
		if(fs.existsSync(usersFileName)) {
			//console.log("Users file exists, exiting command now");
		} else {
			fs.copyFileSync("users.example.json", "users.json");
			console.log("Successfully created new users.json file.");
		}
	}
}