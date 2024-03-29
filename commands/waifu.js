var fs = require("fs");
var svg = require("svg2img");
var Datauri = require("datauri");
var datauri = new Datauri();
var requests = require("sync-request");

module.exports = function(msg) {
	let users = JSON.parse(fs.readFileSync(global.__dirname+"/users.json"));
	if (users[msg.author.id] === undefined) {
		msg.channel.send("You need to generate a profile first. Try **"+global.prefix+"profile**");
		return;
	}

	if (msg.mentions.users.array()[0] == null) {
		msg.channel.send("You didn't mention anyone! Try **"+global.prefix+"waifu (user)**")
	} else {
		msg.channel.startTyping();
		
		users[msg.author.id].waifu.id = msg.mentions.users.array()[0].id;
		users[msg.author.id].waifu.username = msg.mentions.users.array()[0].username;
		fs.writeFileSync(global.__dirname+"/users.json", JSON.stringify(users, null, ""));

		svg(
			fs.readFileSync(global.__dirname+"/svg/waifu.svg", "utf8")
			.replace(/\[avatar_0\]/g, datauri.format(".png", requests("GET", msg.author.avatarURL).getBody()).content)
			.replace(/\[avatar_1\]/g, datauri.format(".png", requests("GET", msg.mentions.users.array()[0].avatarURL).getBody()).content),
		function(err, buffer) {
			msg.channel.send("**"+msg.author.username+"** is now deeply in love with **"+msg.mentions.users.array()[0].username+"**!", {
				files: [{ attachment: new Buffer(buffer) }]
			});
			msg.channel.stopTyping();
		})
	}
}