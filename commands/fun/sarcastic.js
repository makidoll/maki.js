var fs = require("fs");
var svgImg = require("svg2img");
var Discord = require("discord.js");

function getFilenameFromUrl(url) {
	let arr = url.split("/");
	return arr[arr.length-1].toLowerCase();
}

function getFiletype(filename) {
	let arr = filename.split(".");
	return arr[arr.length-1].toLowerCase();
}

module.exports = function(msg) {
	let text = msg.content.slice(global.prefix.length + "sarcastic ".length);

	let lowercase = text.toLowerCase();
	let lol = "";
	lowercase.split("").forEach((chr, i) => {
		if (i%2) {
			lol += chr.toUpperCase();
		} else {
			lol += chr.toLowerCase();
		}
	});

	msg.channel.startTyping();

	svg = fs.readFileSync(global.__dirname+"/svg/sarcastic.svg", "utf8")
		.replace(/\[upper\]/g, msg.author.username.toLowerCase()+": "+lowercase)
		.replace(/\[lower\]/g, lol)

	svgImg(svg, function(err, buffer) {
		if (err) {
			console.log(err);
			msg.channel.send("An error has occurred!");
			msg.channel.stopTyping();
			return;
		}

		msg.channel.send(new Discord.Attachment(buffer));
		msg.channel.stopTyping();
		global.db.exec("UPDATE stats SET value = value + 1 WHERE key = 'sarcastic';");
	});
}