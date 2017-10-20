var request = require("request");

module.exports = {
	msg: function(msg) {
		let username = msg.content.split(" ")[1]+"";

		msg.channel.startTyping();
		if (username !== undefined) {
			request("https://osu.ppy.sh/api/get_user?k="+global.token.osu+"&u="+username, function(err, res, body) {
				if (JSON.parse(body)[0].level != null) {
					let json = JSON.parse(body)[0];
					msg.channel.send({
						"embed": {
							"thumbnail": {
								"url": "https://a.ppy.sh/"+json.user_id
							},
							"author": {
								"name": json.username,
								"url": "https://osu.ppy.sh/u/"+json.user_id,
								"icon_url": "https://a.ppy.sh/"+json.user_id
							},
							"fields": [
								{ "name": "Username", "value": json.username+" :flag_"+json.country.toLowerCase()+":", "inline": true },
								{ "name": "Level", "value": json.level.split(".")[0], "inline": true },
								{ "name": "Accuracy", "value": json.accuracy.split(".")[0]+"%", "inline": true },
								{ "name": "Play count", "value": json.playcount, "inline": true },
								{ "name": "Ranks", "value": "SS: "+json.count_rank_ss+" maps"+"\nS: "+json.count_rank_s+" maps"+"\nA: "+json.count_rank_a+" maps", "inline": true },
							]
						}
					});
				} else {
					msg.channel.send("Username not found! Try **"+global.prefix+"osu (username)**");
				}
				msg.channel.stopTyping();
			})
		} else {
			msg.channel.send("You didn't specify a username. **"+global.prefix+"osu (username)**");
			msg.channel.stopTyping();
		}
	}
}