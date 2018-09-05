module.exports = function(msg, bot) {
	let voiceChannel = msg.member.voiceChannel;
	if (!voiceChannel) return msg.channel.send(
		"You're not in a voice channel!"
	);

	if (!global.voice[msg.guild.id]) return msg.channel.send(
		"I'm not here..."
	);

	try {
		global.voice[msg.guild.id].dispatcher.end();
		global.voice[msg.guild.id].connection.disconnect();
		global.voice[msg.guild.id] = null;
	} catch(err) {}
}