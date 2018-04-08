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
var waaREX = RegExp('[Ww]+[Aa][Aa]+');
var init = require("./init").init

var commands = {
	"help": { msg: require(global.DIRNAME+"/cmd/help").msg },
	"stats": { msg: require(global.DIRNAME+"/cmd/stats").msg },

	"cas": { msg: require(global.DIRNAME+"/cmd/cas").msg },
	"bluemoji": { msg: require(global.DIRNAME+"/cmd/bluemoji").msg },

	"osu": { msg: require(global.DIRNAME+"/cmd/osu").msg },
	"avatar": { msg: require(global.DIRNAME+"/cmd/avatar").msg },
	"server": { msg: require(global.DIRNAME+"/cmd/server").msg },
	//"play": { msg: require(global.DIRNAME+"/cmd/play").msg },
	//:loud_sound: **[prefix]play (url):** Plays a YouTube video in your channel.

	"lewd34": { msg: require(global.DIRNAME+"/cmd/lewd34").msg },
	"lewdgel": { msg: require(global.DIRNAME+"/cmd/lewdgel").msg },
	"lewdkona": { msg: require(global.DIRNAME+"/cmd/lewdkona").msg },

	"profile": { msg: require(global.DIRNAME+"/cmd/profile").msg },
	"waifu": { msg: require(global.DIRNAME+"/cmd/waifu").msg },
	"desc": { msg: require(global.DIRNAME+"/cmd/desc").msg },

	"coinflip": { msg: require(global.DIRNAME+"/cmd/coinflip").msg },
}

// ---------
// Variables
// ---------

global.log = function(msg) { console.log("["+moment().format("HH:mm:ss, DD/MM/YY")+"] "+msg); }
global.pZ = function(str, amt) { return ("00000000"+str).slice(-amt); }

// -------------
// Backup Sysyem
// -------------

let updateBackup = require(__dirname+"/mods/update");
require(__dirname+"/mods/web_server")(bot);

// ----------
// Discord.js
// ----------

bot.on("message", function(msg) {
	if (msg.author.bot) return;  
	
	// Profile
	init();
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
		if (waaREX.test(msg.content)) users[msg.author.id].waaaa += 1;

		// if (users[msg.author.id].waifu.id != "") {
		// 	users[msg.author.id].waifu.id = msg.mentions.users.array()[0].id;
		// 	users[msg.author.id].waifu.username = msg.mentions.users.array()[0].username+" 💕";
		// }

		fs.writeFileSync(global.DIRNAME+"/users.json", JSON.stringify(users, null, ""));
	}
	
	// !! aaaaah
	if (msg.content == "!!") {
		let name = msg.author.username.toLowerCase();
		msg.channel.send("shh "+name+"... i love you. everything will be okay. :heart:")
		return;
	}

	// Commands
	if (msg.content.startsWith(global.prefix)) {
		let cmd = msg.content.toLowerCase().slice(global.prefix.length).split(" ")[0];
		try {
			commands[cmd].msg(msg, bot);
			global.log(msg.author.username+" ran "+msg.content);
		} catch(err) {
			console.log(err);
			msg.channel.send("Command not found or an error occurred. Try **"+global.prefix+"help**");
		}
	}
});

bot.on("ready", function() {
	bot.user.setPresence({ game: { name: global.game, type: 0 } });
	global.log("Bot is online!");
	if (global.backup.active) updateBackup();

	console.log("\nhttps://discordapp.com/oauth2/authorize?client_id=" + bot.user.id + "&scope=bot\n");
	console.log("Currently connected: ");
	for (var i = 0; i < Object.keys(bot.guilds.array()).length; i++) {
		console.log("  " + bot.guilds.array()[i].name + " ("+bot.guilds.array()[i].id+")");
	} console.log("");

	// Fetching invites
	// bot.guilds.find("id", "337938001743314944").fetchInvites().then((invites) => {
	// 	console.log(invites.array());
	// });
	// bot.guilds.find("id", "337938001743314944").defaultChannel.createInvite().then(invite => {
	// 	console.log(invite.code);
	// });

	// Leaving a server
	// bot.guilds.array()[].leave().then(g => console.log("Left the guild ${g}")).catch(console.error); 	

	// Setting avatar
	// bot.user.setAvatar(global.DIRNAME+"/img/avatar.png")
});

bot.login(global.token.discord);
