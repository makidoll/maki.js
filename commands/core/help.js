var fs = require("fs");

module.exports = function(msg) {
	let out =
		"Hi **"+msg.author.username+"**, I was made by https://maki.cat\n"+
		"Type `"+global.prefix+"[command]` to run my commands!\n\n";

	let catagories = Object.keys(global.commands);
	console.log()
	for (var i=0; i<catagories.length; i++) {
		let catagory = global.commands[catagories[i]];
		out += catagory[0]+" **"+catagories[i]+":** ";

		if (catagory[1].length>0) {
			out += "`"+(catagory[1]+"").replace(/,/g, ", ")+"`";
		}

		out += "\n";
	}

	msg.channel.send("", { 
		files: [{ attachment: fs.readFileSync(global.__dirname+"/images/help.png") }]
	}).then(function() {
		msg.channel.send(out);
	});
}