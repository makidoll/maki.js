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
global.DIRNAME = __dirname;

var commands = {
	"help": { msg: require(global.DIRNAME+"/cmd/help").msg },

	"avatar": { msg: require(global.DIRNAME+"/cmd/avatar").msg },
	"osu": { msg: require(global.DIRNAME+"/cmd/osu").msg },

	"play": { msg: require(global.DIRNAME+"/cmd/play").msg },

	"lewd34": { msg: require(global.DIRNAME+"/cmd/lewd34").msg },
	"lewdgel": { msg: require(global.DIRNAME+"/cmd/lewdgel").msg },
	"lewdkona": { msg: require(global.DIRNAME+"/cmd/lewdkona").msg },

	"profile": { msg: require(global.DIRNAME+"/cmd/profile").msg },
	"waifu": { msg: require(global.DIRNAME+"/cmd/waifu").msg },
}

// ---------
// Variables
// ---------

function timelog(msg) { console.log("["+moment().format("HH:mm:ss, DD/MM/YY")+"] "+msg); }

function pZ(str, amt) { return ("00000000"+str).slice(-amt); }

// -------------
// Backup Sysyem
// -------------

function updateBackup() {
	let now = new Date();
	let night = new Date(
		now.getFullYear(), now.getMonth(), now.getDate(),
		global.backup.time[0], global.backup.time[1], global.backup.time[2]
	);
	let update = night.getTime() - now.getTime(); // milliseconds

	if (Math.sign(update) == -1) {
		night = new Date(
			now.getFullYear(), now.getMonth(), now.getDate() + 1,
			global.backup.time[0], global.backup.time[1], global.backup.time[2]
		); 
		update = night.getTime() - now.getTime(); // milliseconds
	}

	timelog("Next backup shall be made at: "+
		pZ(global.backup.time[0], 2)+":"+
		pZ(global.backup.time[1], 2)+":"+
		pZ(global.backup.time[2], 2)+" ("+global.backup.dir+")"
	);

	setTimeout(function() {
		fs.writeFileSync(global.backup.dir+"/users_"+moment().format("DD-MM-YY")+".json", fs.readFileSync(global.DIRNAME+"/users.json"));
		timelog("Backup successfully made in: "+global.backup.dir+"/users_"+moment().format("DD-MM-YY")+".json");
		updateBackup();
	}, update);
}

// ----------
// Discord.js
// ----------

bot.on("message", function(msg) {
	if (msg.author.bot) return;  
	
	// Profile
	let users = JSON.parse(fs.readFileSync(global.DIRNAME+"/users.json"));
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

		if (msg.content.match(/oh my/gi)) users[msg.author.id].oh_my += 1;

		// if (users[msg.author.id].waifu.id != "") {
		// 	users[msg.author.id].waifu.id = msg.mentions.users.array()[0].id;
		// 	users[msg.author.id].waifu.username = msg.mentions.users.array()[0].username+" 💕";
		// }

		fs.writeFileSync(global.DIRNAME+"/users.json", JSON.stringify(users, null, ""));
	}
	
	// Commands
	if (msg.content.startsWith(global.prefix)) {
		let cmd = msg.content.toLowerCase().slice(global.prefix.length).split(" ")[0];
		try {
			commands[cmd].msg(msg);
			timelog(msg.author.username+" ran "+msg.content);
		} catch(err) {
			//console.log(err);
			msg.channel.send("Command not found or an error occurred. Try **"+global.prefix+"help**");
		}
	}
});

bot.on("ready", function() {
	bot.user.setPresence({ game: { name: global.game, type: 0 } });
	timelog("Bot is online!");
	if (global.backup.active) updateBackup();

	console.log("\nhttps://discordapp.com/oauth2/authorize?client_id=" + bot.user.id + "&scope=bot\n");
	console.log("Currently connected: ");
	for (var i = 0; i < Object.keys(bot.guilds.array()).length; i++) {
		console.log("  " + bot.guilds.array()[i]["name"]);
	} console.log("");

	// Leaving a server
	// bot.guilds.array()[].leave().then(g => console.log("Left the guild ${g}")).catch(console.error); 	

	// Setting avatar
	// bot.user.setAvatar(global.DIRNAME+"/img/avatar.png")
});

bot.login(global.token.discord);