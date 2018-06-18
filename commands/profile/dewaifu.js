module.exports = function(msg) {
	let waifu = global.db.prepare("SELECT waifu FROM users WHERE id = '"+msg.author.id+"';").get().waifu;
	waifu = (!waifu)? []: JSON.parse(waifu);

	if (msg.mentions.users.array()[0] == null) {
		msg.channel.send(
			"You didn't mention a user! Try **"+global.prefix+"dewaifu (user)**"
		);
		return;
	}

	let waifu_id = msg.mentions.users.array()[0].id;
	if (!waifu) {
		msg.channel.send("You have no waifus! Try **"+global.prefix+"waifu (user)**");
		return;
	}

	waifu.splice(waifu.indexOf(waifu_id),1);
	global.db.prepare("UPDATE users SET waifu = ? WHERE id = ?;").run(JSON.stringify(waifu), msg.author.id);
	msg.channel.send("\"I really hate you **"+msg.mentions.users.array()[0].username+"!!**\" - **"+msg.author.username+"**");
}