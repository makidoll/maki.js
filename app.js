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

global = Object.assign(global, require(__dirname+"/settings"));
global.__dirname = __dirname;
var db = require(__dirname+"/modules/database");
var privateExists = fs.existsSync(global.__dirname+"/private");
if (privateExists) var privateApp = require(global.__dirname+"/private/app");

var commands = {
	"Core": [":star:",
		["help", "learn", "botstats", "userstats"]
	],
	"Music": [":speaker:",
		["sound", "play", "leave"]
	],
	"Fun": [":tada:",
		["cas", "dont", "text", "isthisa", "sarcastic", "comfy", "slapsroofof", "infowars"]
	],
	"Jail": [":chocolate_bar:",
		["jail", "detain", "jailtype"]
	],
	"Profile": [":hibiscus:",
		["profile", "bg", "waifu", "dewaifu", "waifustats"]
	],
	"Lewd": [":sweat_drops:",
		["e621", "rule34", "gelbooru", "konachan"]
	],
	"Info": [":question:",
		["osu", "avatar", "serverstats", "servermsgs"]
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
global.addS = function(str) { return (str.slice(-1).toLowerCase()=="s")? str+"'": str+"'s"; }
global.voice = {} // guild.id: {connection, dispatcher}

// ----------
// Discord.js
// ----------

bot.on("message", function(msg) {
	if (privateExists) privateApp.onMessage(msg, bot);
	if (msg.author.bot) return;  
	
	// profile
	db.update_msg(msg);

	// bot mention
	if (msg.isMentioned(bot.user)) {
		let chitchit = global.db.prepare("SELECT * FROM chitchat ORDER BY RANDOM() LIMIT 1;").get();
		let sentence = chitchit.sentence;
		if (!sentence) return;

		sentence = sentence.replace(/\[lower-name\]/gi, msg.author.username.toLowerCase());
		sentence = sentence.replace(/\[upper-name\]/gi, msg.author.username.toUpperCase());
		sentence = sentence.replace(/\[name\]/gi, msg.author.username);
		sentence = sentence.replace(/\[server-name\]/gi, (msg.channel.guild)? msg.channel.guild.name: "DMs");
		sentence = sentence.replace(/\[channel-name\]/gi, (msg.channel.guild)? msg.channel.name: global.addS(msg.author.username)+" DMs");
		sentence = sentence.replace(/\[escaped-name\]/gi, escape(msg.author.username));
		sentence = sentence.replace(/\[date\]/gi, moment().format("Do MMM 'YY"));

		let out = '"'+sentence+'"';
		//if (sentence.match("\n")) out+= "\n";
		out += "\n\t*- "+chitchit.username;

		if (chitchit.created) {
			out += " ("+moment(chitchit.created).format("Do MMM 'YY")+")";
		} else {
			out += " (some day)";
		}

		out += "*";
		msg.channel.send(out);
		//return;
	}
	
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
	if (privateExists) privateApp.onReady(bot);
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