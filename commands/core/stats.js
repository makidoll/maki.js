var moment = require("moment");
var fs = require("fs");

function getStat(key) {
	return global.db.prepare("SELECT value FROM stats WHERE key = '"+key+"';").get().value;
}

module.exports = function(msg, bot) {
	let fun = "";

	for (var i=0; i<global.commands["Fun"][1].length; i++) {
		let cmd = global.commands["Fun"][1][i];
		fun += "**"+cmd+":** "+getStat(cmd)+", ";
	}; fun = fun.slice(0,-2);

	let db = global.db.prepare(`SELECT
		COUNT(id) AS cuties, 
		SUM(level) AS level, 
		SUM(xp) AS xp
		FROM users;`
	).get();

	let cuties = db.cuties;
	let level = db.level;
	let xp = db.xp;

	db = global.db.prepare("SELECT COUNT(sentence) AS sentences FROM chitchat;").get();
	let sentences = db.sentences;

	msg.channel.send({
		"embed": {
			"thumbnail": {
				"url": bot.user.avatarURL
			},
			"fields": [
				{ "name": "Created", "value": moment(bot.user.createdAt).format("Do MMMM YYYY"), "inline": true },
				{ "name": "Servers", "value": bot.guilds.array().length+" servers", "inline": true },
				{ "name": "Profiles", "value": cuties+" cuties", "inline": true },
				{ "name": "Total Level/XP", "value": xp+" XP over "+level+" levels", "inline": true },
				{ "name": "Chit Chat", "value": sentences+" sentences", "inline": true },
				{ "name": "Fun Usage", "value": fun, "inline": true },
			]
		}
	});
}