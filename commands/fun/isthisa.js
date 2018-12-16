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
	let quote = msg.content.slice(global.prefix.length + "isthisa ".length);

	if (!msg.attachments.array()[0] || !quote) {
		msg.channel.send("You need to attach an image and say a quote. **"+global.prefix+"isthisa [quote] [attached image]**");
		return;
	} 

	let filename = msg.attachments.array()[0].filename;
	let filetype = getFiletype(filename); 
	let file_url = msg.attachments.array()[0].url;

	if (
		filetype != "png" &&
		filetype != "jpg" &&
		filetype != "jpeg"
	) {
		msg.channel.send("**PNG and JPG** only!");
		return;
	}

	msg.channel.startTyping();

	html = fs.readFileSync(global.__dirname+"/svg/isthisa.svg", "utf8")
		.replace(/\[image\]/g, datauri.format(".png", requests("GET", file_url).getBody()).content)
		.replace(/\[quote\]/g, quote)

	svg.render(html, 564, 423).then(buffer=>{
		// if (err) {
		// 	console.log(err);
		// 	msg.channel.send("An error has occurred!");
		// 	msg.channel.stopTyping();
		// 	return;
		// }

		msg.channel.send(new Discord.Attachment(buffer));
		msg.channel.stopTyping();
		global.db.exec("UPDATE stats SET value = value + 1 WHERE key = 'isthisa';");
	});
}