var fs = require("fs");

module.exports = function(msg) {
	
	let fileName = msg.content.split(" ")[1]+".png";
	let path = global.__dirname+"/backgrounds/"+fileName;
	if (!fs.existsSync(path)) {
		msg.channel.send("Background not found! Choose one here: https://maki.cat/makijs-bg");
		return;
	}

	global.db.prepare("UPDATE users SET bg = ? WHERE id = ?;").run(fileName, msg.author.id);
	msg.channel.send("Your background has been changed! Try **"+global.prefix+"profile**");

}