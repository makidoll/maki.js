var moment = require("moment");

module.exports = function(msg) {
	let amount = global.db.prepare("SELECT COUNT(sentence) AS amount FROM chitchat;").get().amount;
	let sentence = msg.content.substring((global.prefix+"learn ").length).trim();

	if (sentence == "") {
		return msg.channel.send(`You can teach me how to talk! I know ${amount} sentences.

Here's an example of how to use this command:
**m!learn hi [lower-name], you're super cute!**

And here are the parameters you can use:\`\`\`
[lower-name], [upper-name], [name],
[channel-name], [server-name], [date]

[escaped-name] (for URLs, eg. \\n => %0A)\`\`\``);
	}

	global.db.prepare("INSERT INTO chitchat (sentence, username, created) VALUES (?,?,?);").run(
		sentence, msg.author.username, moment().format("YYYY-MM-DD HH:mm:ss"));
	msg.channel.send("I was taught a new sentence by **"+msg.author.username+"**. Thank you! :hearts:")

}