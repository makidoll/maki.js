var fs = require("fs");
var svg = require(global.__dirname+"/modules/svg");
var requests = require("sync-request");
var Discord = require("discord.js");
var Datauri = require("datauri");
var datauri = new Datauri();

function getFilenameFromUrl(url) {
	let arr = url.split("/");
	return arr[arr.length-1].toLowerCase();
}

function getFiletype(filename) {
	let arr = filename.split(".");
	return arr[arr.length-1].toLowerCase();
}

module.exports = function(msg) {
	let filename;
	let filetype;
	let file_url;
	let is_url = (msg.content.toLowerCase().split(" ")[1]);

	if (is_url) {
		file_url = msg.content.toLowerCase().split(" ")[1];
		filename = getFilenameFromUrl(file_url);
		filetype = getFiletype(filename);
	}

	if (!msg.attachments.array()[0] && !is_url) {
		msg.channel.send("You need to attach an image. **"+global.prefix+"dont [url or image]**");
		return;
	} 

	if (!is_url) {
		filename = msg.attachments.array()[0].filename;
		filetype = getFiletype(filename); 
		file_url = msg.attachments.array()[0].url;
	}

	if (
		filetype != "png" &&
		filetype != "jpg" &&
		filetype != "jpeg"
   	   ) {
		msg.channel.send("**PNG and JPG** only!");
		return;
	}	

	msg.channel.startTyping();

	html = fs.readFileSync(global.__dirname+"/svg/dont.svg", "utf8")
		.replace(/\[image\]/g, datauri.format(".png", requests("GET", file_url).getBody()).content)

	svg.render(html, 640, 640).then(buffer=>{
		// if (err) {
		// 	console.log(err);
		// 	msg.channel.send("An error has occurred!");
		// 	msg.channel.stopTyping();
		// 	return;
		// }

		msg.channel.send(new Discord.Attachment(buffer));
		msg.channel.stopTyping();
		global.db.exec("UPDATE stats SET value = value + 1 WHERE key = 'dont';");
	});
}