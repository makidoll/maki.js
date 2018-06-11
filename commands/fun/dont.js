var fs = require("fs");
var svgImg = require("svg2img");
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
		msg.channel.send("You need to attach an image. **"+global.prefix+"dont (url or image)**");
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

	svg = fs.readFileSync(global.__dirname+"/svg/dont.svg", "utf8")
		.replace(/\[image\]/g, datauri.format(".png", requests("GET", file_url).getBody()).content)

	svgImg(svg, function(err, buffer) {
		if (err) console.log(err);
		if (!err) {
			msg.channel.send(new Discord.Attachment(buffer));
			global.db.exec("UPDATE stats SET value = value + 1 WHERE key = 'dont';");
		}
		msg.channel.stopTyping();
	});
}