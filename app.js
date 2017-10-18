//               _    _    _     
//   /\/\   __ _| | _(_)  (_)___ 
//  /    \ / _` | |/ / |  | / __|
// / /\/\ \ (_| |   <| |_ | \__ \
// \/    \/\__,_|_|\_\_(_)/ |___/
//  My trash Discord bot |__/ @makixx 

// -----------
// NPM Modules
// -----------

var Discord = require("discord.js");
var bot = new Discord.Client();
var fs = require("fs");
var moment = require("moment");

// ---------
// Variables
// ---------

global = require(__dirname+"/settings");

var commands = {
	"help": { msg: require(__dirname+"/cmd/help").msg },

	"avatar": { msg: require(__dirname+"/cmd/avatar").msg },
	"osu": { msg: require(__dirname+"/cmd/osu").msg },

	"play": { msg: require(__dirname+"/cmd/play").msg },

	"lewd34": { msg: require(__dirname+"/cmd/lewd34").msg },
	"lewdgel": { msg: require(__dirname+"/cmd/lewdgel").msg },
	"lewdkona": { msg: require(__dirname+"/cmd/lewdkona").msg },

	"profile": { msg: require(__dirname+"/cmd/profile").msg },
	"waifu": { msg: require(__dirname+"/cmd/waifu").msg },
}

// ----------
// Discord.js
// ----------

function timelog(msg) { console.log("["+moment().format("HH:mm:ss, DD/MM/YY")+"] "+msg); }

bot.on("message", function(msg) {
	if (msg.author.bot) return;  
	
	// Profile
	let users = JSON.parse(fs.readFileSync(__dirname+"/users.json"));
	if (users[msg.author.id] !== undefined) {
		if (users[msg.author.id].xp < 1000) {
			users[msg.author.id].xp += 1;
		} else {
			users[msg.author.id].level += 1;
			users[msg.author.id].xp = 0;
			msg.channel.send("Yay, <@"+msg.author.id+"> leveled up from **"+(users[msg.author.id].level-1)+"** to **"+(users[msg.author.id].level)+"**!");
		}
		
		users[msg.author.id].username = msg.author.username;
		users[msg.author.id].avatarURL = msg.author.avatarURL;

		// if (users[msg.author.id].waifu.id != "") {
		// 	users[msg.author.id].waifu.id = msg.mentions.users.array()[0].id;
		// 	users[msg.author.id].waifu.username = msg.mentions.users.array()[0].username+" 💕";
		// }

		fs.writeFileSync(__dirname+"/users.json", JSON.stringify(users, null, ""));
	}
	
	// Commands
	if (msg.content.startsWith(global.prefix)) {
		let cmd = msg.content.toLowerCase().slice(global.prefix.length).split(" ")[0];
		try {
			commands[cmd].msg(msg);
			timelog(msg.author.username+" ran "+msg.content);
		} catch(err) {
			console.log(err);
			msg.channel.send("Command not found or an error occurred. Try **"+global.prefix+"help**");
		}
	}
});

bot.on("ready", function() {
	bot.user.setPresence({ game: { name: global.game, type: 0 } });
	timelog("Bot is up!");
	console.log("https://discordapp.com/oauth2/authorize?client_id=" + bot.user.id + "&scope=bot\n");
	console.log("Currently connected: ");
	for (var i = 0; i < Object.keys(bot.guilds.array()).length; i++) {
		console.log("  " + bot.guilds.array()[i]["name"]);
	} console.log("");
	
	// Leaving a server
	// bot.guilds.array()[].leave().then(g => console.log("Left the guild ${g}")).catch(console.error); 	

	// Setting avatar
	// bot.user.setAvatar(__dirname+"/img/avatar.png")
});

bot.login(global.DISCORD_TOKEN);