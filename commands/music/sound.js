var fs = require("fs");

var usage = global.prefix+"sound [sound]"

function removeFiletype(filename) {
	filename = filename.split(".");
	filename.splice(-1,1);
	return filename.join(".");
}

module.exports = function(msg, bot) {
	let dir = fs.readdirSync(global.__dirname+"/sounds");
	let input = msg.content.slice((global.prefix+"sound ").length).trim();
	let niceDir = [];

	let soundFilename = false;
	for (var i = 0; i < dir.length; i++) {
		if (dir[i] == "ADD SOUNDS HERE") continue;
		let soundname = removeFiletype(dir[i]).toLowerCase();
		niceDir.push(soundname); 

		if (soundname == input) {
			soundFilename = dir[i];
		}
	}

	if (!soundFilename) return msg.channel.send(
		"Sound not found! Try **"+usage+"**\n```\n"+niceDir.join(", ")+"\n```"
	);

	let voiceChannel = msg.member.voiceChannel;
	if (!voiceChannel) return msg.channel.send(
		"You're not in a voice channel!"
	);

	if (global.voice[msg.guild.id]) return msg.channel.send(
		"I'm already playing something on your server! Try **"+global.prefix+"leave**"
	);

	voiceChannel.join().then(connection=>{
		let dispatcher = connection.playFile(global.__dirname+"/sounds/"+soundFilename, {
			volume: 0.6
		});
		
		dispatcher.on("end", ()=>{ setTimeout(()=>{
			voiceChannel.leave();
			global.voice[msg.guild.id] = null;
		}, 400); });

		global.voice[msg.guild.id] = {
			connection: connection,
			dispatcher: dispatcher
		};
	});
}