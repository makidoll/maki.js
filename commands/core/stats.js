var moment = require("moment");
var fs = require("fs");

module.exports = function(msg, bot) {
	let cas = global.db.prepare("SELECT value AS converts FROM stats WHERE key = 'cas_converts';").get().converts;
	let cuties = global.db.prepare("SELECT COUNT(id) AS count FROM users;").get().count;

	msg.channel.send({
		"embed": {
			"thumbnail": {
				"url": bot.user.avatarURL
			},
			"fields": [
				{ "name": "Created", "value": moment(bot.user.createdAt).format("Do MMMM YYYY"), "inline": true },
				{ "name": "Servers", "value": bot.guilds.array().length+" servers", "inline": true },
				{ "name": "Profiles", "value": cuties+" cuties", "inline": true },
				{ "name": "**!cas** converts", "value": cas, "inline": true },
			]
		}
	});
}