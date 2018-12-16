var moment = require("moment");
var mitt = require("mitt");

module.exports = function(msg, bot) {
	try {
		let guild = msg.guild;
		let event = mitt();

		let channels = {};
		guild.channels.array().forEach(channel=>{
			if (channel.type!="text") return;

			channels[channel.id] = null;
			channel.fetchMessages().then(messages=>{
				channels[channel.id] = {
					messages: messages.array().length,
					name: channel.name,
				}
				event.emit("channelFetched");
			}).catch(err=>{
				delete channels[channel.id];
				event.emit("channelFetched");
			});
		});

		event.on("channelFetched", ()=>{
			let channelsKeys = Object.keys(channels);
			for (var i=0; i<channelsKeys.length; i++) {
				if (channels[channelsKeys[i]]==null) return;
			} // all channels are loaded

			let out = "";
			Object.keys(channels).forEach(id=>{
				let info = channels[id];
				out += "**#"+info.name+"**: "+info.messages+" messages\n" 
			});
			msg.channel.send(out);
		});

		// msg.channel.send({
		// 	"embed": {
		// 		"thumbnail": { "url": guild.iconURL },
		// 		"fields": [
		// 			{ "name": "Name", "value": guild.name, "inline": true },
		// 		]
		// 	}
		// });
	} catch(err) {
		console.log(err);
		msg.channel.send("Failed to get server info. Perhaps missing permissions?")
	}
}