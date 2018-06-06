var num = {
	"0": ":zero: ",
	"1": ":one: ",
	"2": ":two: ",
	"3": ":three: ",
	"4": ":four: ",
	"5": ":five: ",
	"6": ":six: ",
	"7": ":seven: ",
	"8": ":eight: ",
	"9": ":nine: "
}

module.exports = function(msg) {

	var text = msg.content.slice(global.prefix.length+5) // text+" " = 5
	if (!text) {
		msg.channel.send("You need to say something. **"+global.prefix+"text (message)**");
		return;
	}

	var out = "";
	var res = text.match(/[0123456789abcdefghijklmnopqrstuvwxyz\ ]/gi);
	for (var i = 0; i < res.length; i++) {
		if (res[i] == " ") {
			out += ":small_blue_diamond: "
		} else if (res[i].match(/[0123456789]/gi)){
			out += num[res[i]];
		} else {
			out += ":regional_indicator_"+res[i].toLowerCase()+": "
		}
	}

	msg.channel.send(out);
	global.db.exec("UPDATE stats SET value = value + 1 WHERE key = 'text';");
}
