var fs = require("fs");
var svgImg = require("svg2img");
var requests = require("sync-request");
var Discord = require("discord.js");
var Datauri = require("datauri");
var datauri = new Datauri();

function getFiletype(filename) {
	let arr = filename.split(".");
	return arr[arr.length-1].toLowerCase();
}

module.exports = function(msg) {
	let args = msg.content.slice(global.prefix.length+"slapsroofof ".length).split(",");

	let thing = args[0];
	args.shift();
	let desc = args.join(",").trim();

	if (!msg.attachments.array()[0] || !thing || !desc) {
		msg.channel.send(
			"You need to attach an image and explain.\n"+
			"```car salesman: *slaps roof of [thing]*\n"+
			"this bad boy can fit so much [desc]```\n"+
			"**"+global.prefix+"slapsroofof [thing], [desc] [attached image]**"
		);
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

	svg = fs.readFileSync(global.__dirname+"/svg/slapsroofof.svg", "utf8")
		.replace(/\[thing\]/g, thing)
		.replace(/\[desc\]/g, desc)
		.replace(/\[image\]/g, datauri.format(".png", requests("GET", file_url).getBody()).content)

	svgImg(svg, function(err, buffer) {
		if (err) {
			console.log(err);
			msg.channel.send("An error has occurred!");
			msg.channel.stopTyping();
			return;
		}

		msg.channel.send(new Discord.Attachment(buffer));
		msg.channel.stopTyping();
		global.db.exec("UPDATE stats SET value = value + 1 WHERE key = 'slapsroofof';");
	});
}