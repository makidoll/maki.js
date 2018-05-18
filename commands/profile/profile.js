var fs = require("fs");
var moment = require("moment");
var svgImg = require("svg2img");
var Datauri = require("datauri");
var datauri = new Datauri();
var requests = require("sync-request");
var db = require(global.__dirname+"/modules/database");

module.exports = function(msg) {
	msg.channel.startTyping();

	let user_id = null;
	if (msg.mentions.users.array()[0]) {
		user_id = msg.mentions.users.array()[0].id;
		db.update_user(msg.author);
	} else {
		user_id = msg.author.id;
	}
	
	let user = global.db.prepare("SELECT * FROM users WHERE id = ?").get(user_id);

	let avatar = "data:image/png;base64,0;";
	if (msg.author.avatarURL) avatar = datauri.format(".png", requests("GET", msg.author.avatarURL).getBody()).content;

	// let desc = '<tspan x="30" dy="1.1em">'+users[user.id].desc.match(/.{1,34}/g).join('</tspan><tspan x="30" dy="1.1em">')+"</tspan>";
	let waifus = [];

	svg = fs.readFileSync(global.__dirname+"/svg/profile.svg", "utf8")
		.replace(/\[username\]/g, user.username)
		.replace(/\[avatar\]/g, avatar)
		.replace(/\[level\]/g, user.level)
		.replace(/\[xp\]/g, user.xp)
		.replace(/\[xp-x\]/g, (user.xp/1000*270)+130)
		.replace(/\[xp-width\]/g, 270-(user.xp/1000*270))
		.replace(/\[background\]/g, 
			(user.bg)? global.__dirname+"/backgrounds/"+user.bg: "")

	if (waifus != []) {
		svg = svg.replace(/<waifu>([\S\s]*?)<\/waifu>/g, "");
	}

	svgImg(svg, function(err, buffer) {
		msg.channel.stopTyping();
		msg.channel.send("", {
			files: [{ attachment: new Buffer(buffer) }]
		});	
	});

}

	// msg.channel.send({
	// 	"embed": {
	// 		"author": {
	// 			"name": msg.author.username,
	// 			"icon_url": msg.author.avatarURL
	// 		},
	// 		"url": "https://maki.cat/js",
	// 		"thumbnail": {
	// 			"url": msg.author.avatarURL
	// 		},
	// 		"fields": [
	// 			{
	// 				"name": "Level",
	// 				"value": "(image to show progress)\nLevel "+users[msg.author.id].level+" ("+users[msg.author.id].xp+"/1000)",
	// 				"inline": true
	// 			},
	// 			{
	// 				"name": "Coins",
	// 				"value": users[msg.author.id].coins+" :small_orange_diamond:",
	// 				"inline": true
	// 			},
	// 			{
	// 				"name": "Waifu",
	// 				"value": users[msg.author.id].waifu.username+" :two_hearts:",
	// 				"inline": true
	// 			},
	// 			{
	// 				"name": "Leaderboard",
	// 				"value": "https://maki.cat/js",
	// 				"inline": true
	// 			},
	// 			{
	// 				"name": "Stats",
	// 				"value": "• Cutie since "+moment.unix(users[msg.author.id].created).format("Do MMM 'YY")+"\n"+
	// 				         "• Maki.js knows "+Object.keys(users).length+" cuties in total!\n",
	// 				"inline": true
	// 			}
	// 		]
	// 	}
	// });