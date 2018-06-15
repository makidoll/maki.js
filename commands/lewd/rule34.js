var request = require("request");
var xml2json = require("xml2json");

module.exports = function(msg) {
	if (!msg.channel.nsfw && !(msg.channel.type === "dm")) { msg.channel.send("You can only use this command in **NSFW** channels."); msg.channel.stopTyping(); return; }
	if (msg.content.split(" ")[1] == undefined) { msg.channel.send("Incorrect syntax! Try **"+global.prefix+"lewd34 (tag)**"); msg.channel.stopTyping(); return; }

	let tag = msg.content.split(" ")[1].toLowerCase();
	msg.channel.startTyping();

	request("http://rule34.xxx/index.php?page=dapi&s=post&q=index&tags="+tag, function (err, res, body) {
		if (err) { msg.channel.send("Oh no! Rule34 isn't working."); msg.channel.stopTyping(); return; }

		var json = JSON.parse(xml2json.toJson(body));
		try {
			var post_length = json["posts"]["post"].length;
			var post_num = Math.floor(Math.random()*(post_length-0)+0);
			//msg.channel.send("**This was rated with " + json["posts"]["post"][post_num]["score"] + " points and the tags are:**\n`" + json["posts"]["post"][post_num]["tags"] + "`\nhttp:" + json["posts"]["post"][post_num]["file_url"]);
			msg.channel.send("This was rated with **" + json["posts"]["post"][post_num]["score"] + " points**:\n" + json["posts"]["post"][post_num]["file_url"]);
		} catch(err) {
			msg.channel.send("Nothing exists with **" + tag + "**!");
		}  	
		msg.channel.stopTyping();
	});
}