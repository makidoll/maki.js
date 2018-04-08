var fs = require("fs");
var moment = require("moment");
var svg = require("svg2img");
var Datauri = require("datauri");
var datauri = new Datauri();
var requests = require("sync-request");

module.exports = {
	msg: function(msg) {

		let users = JSON.parse(fs.readFileSync(global.DIRNAME+"/users.json"));
		msg.channel.startTyping();

		// Adding profile
		
		if (users[msg.author.id] === undefined) {
			users[msg.author.id] = {
				"username": msg.author.username,
				"level": 1,
				"xp": 0,
				"coins": 100,
				"waifu": {
					"id": "",
					"username": ""
				},
				"oh_my": 0,
				"waaaa": 0,
				"desc": "Setup a description:              "+global.prefix+"desc (text)",
				"avatarURL": msg.author.avatarURL,
				"created": moment().unix()
			};
			fs.writeFileSync(global.DIRNAME+"/users.json", JSON.stringify(users, null, ""));
			
			msg.channel.send("Generating a new profile...");
		}

		// Viewing Profile

		let user = (msg.mentions.users.array()[0]) ? msg.mentions.users.array()[0] : msg.author;

		let avatar = datauri.format(".png", requests("GET", user.avatarURL).getBody()).content;
		let desc = '<tspan x="30" dy="1.1em">'+users[user.id].desc.match(/.{1,34}/g).join('</tspan><tspan x="30" dy="1.1em">')+"</tspan>";

		svg(
			fs.readFileSync(global.DIRNAME+"/svg/profile.svg", "utf8")
			.replace(/\[avatar\]/g, avatar)
			.replace(/\[xp\]/g, (users[user.id].xp/1000)*300)
			.replace(/\[level\]/g, "Level "+users[user.id].level+" ("+users[user.id].xp+"/1000)")
			.replace(/\[waifu\]/g, users[user.id].waifu.username)
			.replace(/\[coins\]/g, users[user.id].coins)
			.replace(/\[username\]/g, user.username)
			.replace(/\[oh_my\]/g, users[user.id].oh_my + " times")
			.replace(/\[waaaa\]/g, users[user.id].waaaa + " times")
			.replace(/\[desc\]/g, desc),
		function(err, buffer) {
			msg.channel.stopTyping();
			msg.channel.send("", {
				files: [{ attachment: new Buffer(buffer) }]
			});	
		})

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
	}
}
