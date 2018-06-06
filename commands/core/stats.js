var moment = require("moment");
var fs = require("fs");

function getStat(key) {
	return global.db.prepare("SELECT value FROM stats WHERE key = '"+key+"';").get().value;
}

module.exports = function(msg, bot) {
	let p = global.prefix;
	let fun = 
		"**"+p+"magic:** "+getStat("magic")+"\n"+
		"**"+p+"hoh:** "+getStat("hoh")+"\n"+
		"**"+p+"hah:** "+getStat("hah")+"\n"+
		"**"+p+"text:** "+getStat("text");

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
				{ "name": "Fun", "value": fun, "inline": true },
			]
		}
	});
}