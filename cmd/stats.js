var moment = require("moment");
var fs = require("fs");

module.exports = {
	msg: function(msg, bot) {
		let cuties = Object.keys(JSON.parse(fs.readFileSync(global.DIRNAME+"/users.json", "utf8"))).length;
		let casConverts = JSON.parse(fs.readFileSync(global.DIRNAME+"/stats.json", "utf8"))["casConverts"];

		msg.channel.send({
			"embed": {
				"thumbnail": {
					"url": bot.user.avatarURL
				},
				"fields": [
					{ "name": "Created", "value": moment(bot.user.createdAt).format("Do MMMM YYYY"), "inline": true },
					{ "name": "Servers", "value": bot.guilds.array().length+" servers", "inline": true },
					{ "name": "Profiles", "value": cuties+" cuties", "inline": true },
					{ "name": "**!cas** converts", "value": casConverts, "inline": true },
				]
			}
		});
	}
}