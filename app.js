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
global.__dirname = __dirname;
var db = require(__dirname+"/modules/database");
var private = fs.existsSync(global.__dirname+"/private");
if (private) var privateApp = require(global.__dirname+"/private/app");

// "waifu",
// "desc",
// "coinflip"

var commands = {
	"Core": [":star:",
		["help", "stats"]
	],
	"Fun": [":tada:",
		["cas", "hoh", "hah", "dont", "text", "isthisa"]
	],
	"Profile": [":hibiscus:",
		["profile", "bg", "waifu", "waifustats"]
	],
	"Lewd": [":sweat_drops:",
		["e621", "rule34", "gelbooru", "konachan"]
	],
	"Info": [":question:",
		["osu", "avatar", "server"]
	],
}

global.commands = JSON.parse(JSON.stringify(commands));

commands = {};
for (var x=0; x<Object.keys(global.commands).length; x++) {

	let key = Object.keys(global.commands)[x];
	for (var y=0; y<global.commands[key][1].length; y++) {
		let cmd = global.commands[key][1][y];
		commands[cmd] = require(global.__dirname+"/commands/"+
			key.toLowerCase().replace(/ /g, "_")+"/"+cmd);
	}
}

// ---------
// Variables
// ---------

global.log = function(msg) { console.log("["+moment().format("HH:mm:ss, DD/MM/YY")+"] "+msg); }
global.pZ = function(str, amt) { return ("00000000"+str).slice(-amt); }

// ----------
// Discord.js
// ----------


bot.on("message", function(msg) {
	if (private) privateApp.onMessage(msg, bot);
	if (msg.author.bot) return;  
	
	// profile
	db.update_msg(msg);
	
	// !! aaaaah
	if (msg.content.substring(0,2) == "!!") {
		let name = msg.author.username.toLowerCase();
		msg.channel.send("shh "+name+"... i love you. everything will be okay. :heart:")
		return;
	}

	// commands
	if (msg.content.toLowerCase().substring(0, global.prefix.length) == global.prefix) {
		let cmd = msg.content.toLowerCase().slice(global.prefix.length).split(" ")[0];
		try {
			commands[cmd](msg, bot);
			global.log(
				((msg.guild)? "("+msg.guild.name+") ": "")+
				msg.author.username+" ran "+msg.content
			);
		} catch(err) {
			console.log(err);
			msg.channel.send("Command not found or an error occurred. Try **"+global.prefix+"help**");
		}
	}
});

bot.on("ready", function() {
	global.log("Bot is online!");
	if (private) privateApp.onReady(bot);
	bot.user.setPresence({ game: { name: global.game, type: 0 } });

	if (global.backup.active) require(__dirname+"/modules/backup")();
	if (global.web.active) require(__dirname+"/modules/web_server")(bot);

	console.log("\nhttps://discordapp.com/oauth2/authorize?client_id=" + bot.user.id + "&scope=bot\n");
	console.log("Currently connected: ");
	for (var i = 0; i < Object.keys(bot.guilds.array()).length; i++) {
		console.log("  " + bot.guilds.array()[i].name + " ("+bot.guilds.array()[i].id+")");
	} console.log("");

	// Fetching invites
	// bot.guilds.find("id", "338094195501694976").fetchInvites().then((invites) => {
	// 	console.log(invites.array());
	// });
	// bot.guilds.find("id", "338094195501694976").defaultChannel.createInvite().then(invite => {
	// 	console.log(invite.code);
	// });

	// Leaving a server
	// bot.guilds.array()[].leave().then(g => console.log("Left the guild ${g}")).catch(console.error); 	

	// Setting avatar
	// bot.user.setAvatar(global.__dirname+"/img/avatar.png")
});

bot.login(global.token.discord);
db.init();