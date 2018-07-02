var fs = require("fs");
var svgImg = require("svg2img");
var requests = require("sync-request");
var Discord = require("discord.js");
var Datauri = require("datauri");
var datauri = new Datauri();
var average = require("image-average-color");

module.exports = function(msg) {
	msg.channel.startTyping();

	let avatar = msg.author.displayAvatarURL;
	if (msg.mentions.users.array()[0]) {
		avatar = msg.mentions.users.array()[0].displayAvatarURL;
	}
	if (msg.attachments.array()[0]) {
		avatar = msg.attachments.array()[0].url;
	}

	avatar = requests("GET", avatar).getBody();
	average(avatar, (err, rgb) => {

		if (err) {
			console.log(err);
			msg.channel.send("An error has occurred!");
			msg.channel.stopTyping();
			return;
		}

		svg = fs.readFileSync(global.__dirname+"/svg/comfy.svg", "utf8")
			.replace(/\[avatar\]/g, datauri.format(".png", avatar).content)
			.replace(/\[r\]/g, rgb[0]/255)
			.replace(/\[g\]/g, rgb[1]/255)
			.replace(/\[b\]/g, rgb[2]/255)

		svgImg(svg, function(err, buffer) {
			if (err) {
				console.log(err);
				msg.channel.send("An error has occurred!");
				msg.channel.stopTyping();
				return;
			}

			msg.channel.send(new Discord.Attachment(buffer));
			msg.channel.stopTyping();
			global.db.exec("UPDATE stats SET value = value + 1 WHERE key = 'comfy';");
		});

	});
}