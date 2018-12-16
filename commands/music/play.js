let usage = global.prefix+"play [music/youtube link]";

var ytdl = require("ytdl-core");
var stream = require("stream");
var request = require("request");
var fs = require("fs");

const playStream = (msg,voiceChannel,stream)=>{
	voiceChannel.join().then(connection=>{
		let dispatcher = connection.playStream(stream, {
			bitrate: 48000, volume: 0.25
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
};

module.exports = function(msg, bot) {
	let input = msg.content.slice((global.prefix+"play ").length).trim();
	if (!input) return msg.channel.send(
		"Play music on your voice channel! Try **"+usage+"**"
	);

	let voiceChannel = msg.member.voiceChannel;
	if (!voiceChannel) return msg.channel.send(
		"You're not in a voice channel!"
	);

	if (global.voice[msg.guild.id]) return msg.channel.send(
		"I'm already playing something on your server! Try **"+global.prefix+"leave**"
	);

	// if (input.substring(0,4).toLowerCase() != "http")
	// 	input = "ytsearch:"+input

	//msg.channel.send("Loading video...")
	if (input.indexOf("youtube")!=-1||
		input.indexOf("youtu.be")!=-1) {
		var stream = ytdl(input, {
			quality: "highestaudio",
			filter: "audioonly",
		});

		stream.on("info", info=>{
			// msg.channel.send(
			// 	"Loading...\n**"+info.title+"**"+
			// 	//"\nby: **"+info.uploader+"**"+
			// 	"\n(might take a while :/)"
			// );
			msg.channel.send("Playing **"+info.title+"** in **"+voiceChannel.name+"**");
			playStream(msg,voiceChannel,stream);
		});
	} else {
		var stream = fs.createWriteStream("/tmp/"+msg.id);
		stream.on("open",()=>{
			request(input).pipe(stream);
			msg.channel.send("Loading...");
		});
		stream.on("finish",()=>{
			msg.channel.send("Playing **"+input+"** in **"+voiceChannel.name+"**");
			playStream(msg,voiceChannel,fs.createReadStream("/tmp/"+msg.id));
		})
	}

}  