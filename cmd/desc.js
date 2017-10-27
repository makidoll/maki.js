var fs = require("fs");
var svg = require("svg2img");
var Datauri = require("datauri");
var datauri = new Datauri();
var requests = require("sync-request");

module.exports = {
	msg: function(msg) {
		let users = JSON.parse(fs.readFileSync(global.DIRNAME+"/users.json"));
		if (users[msg.author.id] === undefined) {
			msg.channel.send("You need to generate a profile first. Try **"+global.prefix+"profile**");
			return;
		}
	
		let desc = msg.content.slice(global.prefix.length+5); // "!desc "

		if (desc.length > 204) {
			return msg.channel.send("Your message is too long! Maximum **204 characters.**");
		}

		users[msg.author.id].desc = desc;
		fs.writeFileSync(global.DIRNAME+"/users.json", JSON.stringify(users, null, ""));

		let desc_formatted = desc.match(/.{1,34}/g).join("\n");
		msg.channel.send("Your description has been set to: ```"+desc_formatted+"```");
	}
}