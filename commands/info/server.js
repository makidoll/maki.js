var moment = require("moment");

module.exports = function(msg) {
	try {
		let guild = msg.guild;
		msg.channel.send({
			"embed": {
				"thumbnail": {
					"url": guild.iconURL
				},
				"fields": [
					{ "name": "Name", "value": guild.name, "inline": true },
					{ "name": "Created", "value": moment(guild.createdTimestamp).format("Do MMMM YYYY"), "inline": true },
					{ "name": "Channels", "value": guild.channels.array().length+" channels", "inline": true },
					{ "name": "Members", "value": guild.memberCount, "inline": true },
					{ "name": "Owner", "value": guild.owner.user.username, "inline": true },
					{ "name": "Region", "value": guild.region, "inline": true },
				]
			}
		});
	} catch(err) {
		msg.channel.send("Failed to get server info. Perhaps missing permissions?")
	}
}