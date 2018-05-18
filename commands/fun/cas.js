var fs = require("fs");
var im = require("imagemagick");
var request = require("request");
var Discord = require("discord.js")

function getFilenameFromUrl(url) {
	let arr = url.split("/");
	return arr[arr.length-1].toLowerCase();
}

function getFiletype(filename) {
	let arr = filename.split(".");
	return arr[arr.length-1].toLowerCase();
}

module.exports = function(msg) {
	let filename;
	let filetype;
	let file_url;
	let is_url = (msg.content.toLowerCase().split(" ")[1]);

	if (is_url) {
		file_url = msg.content.toLowerCase().split(" ")[1];
		filename = getFilenameFromUrl(file_url);
		filetype = getFiletype(filename);
	}

	if (!msg.attachments.array()[0] && !is_url) {
		msg.channel.send("You need to attach an image. **"+global.prefix+"cas (url or image)**");
		return;
	} 

	if (!is_url) {
		filename = msg.attachments.array()[0].filename;
		filetype = getFiletype(filename); 
		file_url = msg.attachments.array()[0].url;
	}

	if (
		filetype != "png" &&
		filetype != "jpg" &&
		filetype != "jpeg" &&
		filetype != "gif"
   	   ) {
		msg.channel.send("**PNG, JPG and GIF** only!");
		return;
	}	

	msg.channel.startTyping();
	request({url: file_url, encoding: "binary"}, function(err, res, body) {
		if (err) {
			msg.channel.send("Error whilst downloading image!");
			msg.channel.stopTyping();
			return;
		}

		if (!fs.existsSync("/tmp/maki.js")) fs.mkdirSync("/tmp/maki.js");
		let file_dir = "/tmp/maki.js/"+filename;
		fs.writeFile(file_dir, body, "binary", function(err) {
			if (err) {
				msg.channel.send("Error whilst retrieving image!");
				msg.channel.stopTyping();
				console.log(err);
			}

			let cas_file_dir = file_dir+"_cas."+filetype;
			setTimeout(function() {
				im.convert([file_dir, 
					"-scale", "x720",
					"-liquid-rescale", (1/3*100)+"%",
					"-scale", (3/1*100)+"%",
				cas_file_dir], function(err, stdout) {
					if (err) {
						msg.channel.send("Error whilst converting image!");
						msg.channel.stopTyping();
						global.log(err);
						return;
					}

					msg.channel.send(new Discord.Attachment(cas_file_dir));
					msg.channel.stopTyping();

					// update stats
					global.db.exec("UPDATE stats SET value = value + 1 WHERE key = 'cas_converts';");
				});
			}, 200);
		});
	});
}