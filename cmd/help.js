var fs = require("fs");

module.exports = {
	msg: function(msg) {
		let out = "Hey <@"+msg.author.id+">,\nI was made by `@makixx` on Github!\n\nHere are my commands:\n\n";
		//for (var i=0; i<Object.keys(commands).length; i++) {
		//	out +=
		//		"**"+commands[Object.keys(commands)[i]].emoji+
		//		" "+info.prefix+Object.keys(commands)[i]+
		//		commands[Object.keys(commands)[i]].syntax+":** "+
		//		commands[Object.keys(commands)[i]].desc+"\n";
		//}
		//out += "\n";
	
		out += fs.readFileSync(global.DIRNAME+"/help.txt");

		msg.author.send("", { 
			files: [{ attachment: fs.readFileSync(global.DIRNAME+"/img/help.png") }]
		}).then(function() {
			msg.author.send(out);
		});
		
		msg.channel.send("Slide into the DM*ss*, I sent you a message!");
	}
}