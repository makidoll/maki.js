var request = require("request");

module.exports = {
	msg: function(msg) {
		if (!msg.channel.nsfw && !(msg.channel.type === "dm")) { msg.channel.send("You can only use this command in **NSFW** channels."); msg.channel.stopTyping(); return; }
		if (msg.content.split(" ")[1] == undefined) { msg.channel.send("Incorrect syntax! Try **"+global.prefix+"lewde621 (tag)**"); msg.channel.stopTyping(); return; }

		let tag = msg.content.split(" ")[1].toLowerCase();
		msg.channel.startTyping();

		request("https://e621.net/post/index.json?tags="+tag, function (err, res, body) {
			if (err) { msg.channel.send("Oh no! Gelbooru isn't working."); msg.channel.stopTyping(); return; }

			var json = JSON.parse(body);
			try {
				var post_length = json.length;
				var post_num = Math.floor(Math.random()*post_length);
				//msg.channel.send("**This was rated with " + json["posts"]["post"][post_num]["score"] + " points and the tags are:**\n`" + json["posts"]["post"][post_num]["tags"] + "`\nhttp:" + json["posts"]["post"][post_num]["file_url"]);
				msg.channel.send("This post by **"+json[post_num]["author"]+"** was rated with **" + json[post_num]["score"] + " points**:\n" + json[post_num]["file_url"]);
			} catch(err) {
				msg.channel.send("Nothing exists with **" + tag + "**!");
			}  	
			msg.channel.stopTyping();
		});
	}
}