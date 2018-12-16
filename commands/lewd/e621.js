var request = require("request");

module.exports = function(msg) {
	let splitTags = msg.content.split(" ");

	if (!msg.channel.nsfw && !(msg.channel.type === "dm")) { msg.channel.send("You can only use this command in **NSFW** channels."); msg.channel.stopTyping(); return; }
	if (splitTags[1] == undefined) { msg.channel.send("Incorrect syntax! Try **"+global.prefix+"e621 (tag)**"); msg.channel.stopTyping(); return; }

	splitTags.shift();
	tags = splitTags.join(",");

	msg.channel.startTyping();
	request({
		url: "https://e621.net/post/index.json?tags="+tags,
		headers: {
			"User-Agent": "Maki.js"
		}
	}, function (err, res, body) {
		if (err) { msg.channel.send("Oh no! e621 isn't working."); msg.channel.stopTyping(); return; }

		try {
			var json = JSON.parse(body);
			var post_length = json.length;
			var post_num = Math.floor(Math.random()*post_length);
			//msg.channel.send("**This was rated with " + json["posts"]["post"][post_num]["score"] + " points and the tags are:**\n`" + json["posts"]["post"][post_num]["tags"] + "`\nhttp:" + json["posts"]["post"][post_num]["file_url"]);
			msg.channel.send("This post by **"+json[post_num]["author"]+"** was rated with **" + json[post_num]["score"] + " points**:\n" + json[post_num]["file_url"]);
		} catch(err) {
			msg.channel.send("Nothing exists with **" + tags + "**!");
		}  	
		msg.channel.stopTyping();
	});
}