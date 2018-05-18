var fs = require("fs");
var svg = require("svg2img");
var Datauri = require("datauri");
var datauri = new Datauri();
var requests = require("sync-request");

module.exports = function(msg) {

	let users = JSON.parse(fs.readFileSync(global.__dirname+"/users.json"));
	if (users[msg.author.id] === undefined) {
		msg.channel.send("You need to generate a profile first. Try **"+global.prefix+"profile**");
		return;
	}

	let amt = parseInt(msg.content.split(" ")[1]);
	if (amt == undefined) {
		msg.channel.send("You need to specify an amount. Try **"+global.prefix+"coinflip (amount)**");
		return;
	}

	msg.channel.startTyping();
	if (Math.random() < 0.5) {

		svg(
			fs.readFileSync(global.__dirname+"/svg/coin.svg", "utf8")
			.replace(/\[avatar\]/g, datauri.format(".png", requests("GET", msg.author.avatarURL).getBody()).content)
			.replace(/\[coin\]/g, datauri.format(".png", fs.readFileSync(global.__dirname+"/img/coin-win.png")).content),
		function(err, buffer) {
			msg.channel.send("**You win!** (+"+amt+" coins)", {
				files: [{ attachment: new Buffer(buffer) }]
			});
			users[msg.author.id].coins += amt;
			fs.writeFileSync(global.__dirname+"/users.json", JSON.stringify(users, null, ""));
			msg.channel.stopTyping();
		});

	} else {
		msg.channel.send("**You lose!** (-"+amt+" coins)", {
			files: [{ attachment: new Buffer(fs.readFileSync(global.__dirname+"/img/coin-lose.png")) }]
		});
		users[msg.author.id].coins -= amt;
		fs.writeFileSync(global.__dirname+"/users.json", JSON.stringify(users, null, ""));
		msg.channel.stopTyping();
	}	
}
