var moment = require("moment");
var fs = require("fs");

function getStat(key) {
	return global.db.prepare("SELECT value FROM stats WHERE key = '"+key+"';").get().value;
}

module.exports = function(msg, bot) {
	let p = global.prefix;
	let fun = "";

	for (var i=0; i<global.commands["Fun"][1].length; i++) {
		let cmd = global.commands["Fun"][1][i];
		fun += "**"+p+cmd+":** "+getStat(cmd)+"\n";
	}; fun = fun.slice(0,-1);

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