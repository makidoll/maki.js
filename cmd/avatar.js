module.exports = {
	msg: function(msg) {
		if (msg.mentions.users.array()[0] == null) {
			msg.channel.send("No user/s mentioned! Try **"+global.prefix+"avatar (user/s)**")
		} else {
			for (i in msg.mentions.users.array()) {
				msg.channel.send(msg.mentions.users.array()[i].avatarURL);
			}
		}
	}
}