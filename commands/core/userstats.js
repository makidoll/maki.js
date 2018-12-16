var moment = require("moment");
var fs = require("fs");

const beautifyInt = n=>{
	let out = "";
	n = (n+"").split("");
	for (var i=n.length-1; i>=0; i--) {
		out = (((n.length-i)%3==0&&i!=0)?",":"")+n[i]+out;
	}
	return out;
}

module.exports = function(msg, bot) {
	let mention = msg.mentions.users.first();
	let user = (mention)? mention: msg.author;

	msg.channel.send({
		"embed": {
			"thumbnail": {
				"url": user.displayAvatarURL
			},
			"fields": [
				{ "name": "Created", "value": moment(user.createdAt).format("Do MMMM YYYY"), "inline": true },
				{ "name": "Username", "value": user.username, "inline": true },
				{ "name": "ID", "value": user.id, "inline": true },
			]
		}
	});
}