var fs = require("fs");
var requests = require("sync-request");

module.exports = function(msg) {
	
	let fileName = msg.content.split(" ")[1]+".png";
	let path = global.__dirname+"/backgrounds/"+fileName;
	if (!fs.existsSync(path) && !msg.attachments.array()[0]) {
		msg.channel.send("**Choose a background** from **https://maki.cat/makijs-bg** or\n"+
			"Make a custom background that's **400x120** and run **"+global.prefix+"bg (image)**");
		return;
	}

	if (msg.attachments.array()[0]) {
		fs.writeFileSync(global.__dirname+"/cache/backgrounds/"+msg.author.id+".png",
			requests("GET", msg.attachments.array()[0].url).getBody()
		);
		fileName = "/cache/backgrounds/"+msg.author.id+".png";
	} else {
		fileName = "/backgrounds/"+fileName;
	}

	global.db.prepare("UPDATE users SET bg = ? WHERE id = ?;").run(fileName, msg.author.id);
	msg.channel.send("Your background has been changed! Try **"+global.prefix+"profile**");

}