var fs = require("fs");
var moment = require("moment");
var datauri = new (require("datauri"));
var requests = require("sync-request");
var db = require(global.__dirname+"/modules/database");
var svg = require(global.__dirname+"/modules/svg");

var waifu_pos = [
	{x:15,y:185},
	{x:50,y:185},
	{x:85,y:185},
	{x:15,y:220},
	{x:50,y:220},
	{x:85,y:220},
	{x:15,y:255},
	{x:50,y:255},
	{x:85,y:255},
];

module.exports = function(msg) {
	msg.channel.startTyping();

	let discord_user = null;
	if (msg.mentions.users.array()[0]) {
		discord_user = msg.mentions.users.array()[0];
		db.update_user(discord_user);
	} else {
		discord_user = msg.author;
	}
	
	let user = global.db.prepare("SELECT * FROM users WHERE id = ?").get(discord_user.id);

	let avatar = "";
	if (discord_user.displayAvatarURL) avatar = datauri.format(".png", requests("GET", discord_user.displayAvatarURL).getBody()).content;

	// let desc = '<tspan x="30" dy="1.1em">'+users[user.id].desc.match(/.{1,34}/g).join('</tspan><tspan x="30" dy="1.1em">')+"</tspan>";
	let waifu = (user.waifu)? JSON.parse(user.waifu): [];

	html = fs.readFileSync(global.__dirname+"/svg/profile.svg", "utf8")
		.replace(/\[username\]/g, user.username)
		.replace(/\[avatar\]/g, avatar)
		.replace(/\[level\]/g, user.level)
		.replace(/\[xp\]/g, user.xp)
		.replace(/\[xp-x\]/g, (user.xp/1000*270)+130)
		.replace(/\[xp-width\]/g, 270-(user.xp/1000*270))
		.replace(/\[background\]/g, (user.bg)?
			datauri.format(".png", fs.readFileSync(global.__dirname+user.bg)).content: "")

	if (waifu.length>0) {
		let waifu_svg = "";
		waifu_svg += '<rect clip-path="url(#background)" width="130" height="120" y="180" fill="#fff"/>';
		waifu.forEach((id, i) => {
			if (i>9) return;
			waifu_svg += '<image height="30" width="30" x="'+
				waifu_pos[i].x+'" y="'+
				waifu_pos[i].y+'" clip-path="url(#waifu-'+i+')" href="'+
				datauri.format(".png", fs.readFileSync(global.__dirname+"/cache/avatars/"+id+".png")).content+'"/>';
		});

		html = html.replace(/<!--\[waifu\]-->/g, waifu_svg);
	}

	svg.render(html, 400, 300).then(buffer=>{
		msg.channel.stopTyping();
		msg.channel.send("", {
			files: [{ attachment: buffer }]
		});	
	}).catch(err=>{
		console.log(err);
	});
}

// msg.channel.send({
// 	"embed": {
// 		"author": {
// 			"name": msg.author.username,
// 			"icon_url": msg.author.displayAvatarURL
// 		},
// 		"url": "https://maki.cat/js",
// 		"thumbnail": {
// 			"url": msg.author.displayAvatarURL
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
