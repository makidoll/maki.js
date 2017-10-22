var fs = require("fs");
var svg = require("svg2img");
var Datauri = require("datauri");
var datauri = new Datauri();
var requests = require("sync-request");

module.exports = {
	msg: function(msg) {

		let users = JSON.parse(fs.readFileSync(global.DIRNAME+"/users.json"));

		msg.channel.startTyping();
		if (Math.random() < 0.5) {

			svg(
				fs.readFileSync(global.DIRNAME+"/svg/coin.svg", "utf8")
				.replace(/\[avatar\]/g, datauri.format(".png", requests("GET", msg.author.avatarURL).getBody()).content)
				.replace(/\[coin\]/g, datauri.format(".png", fs.readFileSync(global.DIRNAME+"/img/coin-win.png")).content),
			function(err, buffer) {
				msg.channel.send("**You win!** (+10 coins)", {
					files: [{ attachment: new Buffer(buffer) }]
				});
				users[msg.author.id].coins += 10;
				fs.writeFileSync(global.DIRNAME+"/users.json", JSON.stringify(users, null, ""));
				msg.channel.stopTyping();
			});

		} else {
			msg.channel.send("**You lose!** (-10 coins)", {
				files: [{ attachment: new Buffer(fs.readFileSync(global.DIRNAME+"/img/coin-lose.png")) }]
			});
			users[msg.author.id].coins -= 10;
			fs.writeFileSync(global.DIRNAME+"/users.json", JSON.stringify(users, null, ""));
			msg.channel.stopTyping();
		}

		
	}
}
