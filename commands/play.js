var ytdl = require("ytdl-core");

module.exports = function(msg) {
	let voiceChannel = msg.member.voiceChannel;
	if (!voiceChannel) {
		return msg.channel.send("You must be in a voice channel.");
	}

	let input = msg.content.slice(global.prefix.length).split(" ")[1];
	
	ytdl.getInfo(input, {
		filter: "audio"
	}, function(err, info) {
		if (err) {
			console.log(err);
			return msg.channel.send("Video could not be found.");
		}
		
		let stream = ytdl(input, {
			filter: "audioonly"
		});
		
		voiceChannel.join().then(function(connection) {
			let dispatcher = connection.playStream(stream);
			dispatcher.on("end", function() {
				voiceChannel.leave();
			});
		}).catch(function(err) {
			return console.log(err);
		});
		
		msg.channel.send("Playing **"+info.title+"** in **"+voiceChannel.name+"**");
	});

}