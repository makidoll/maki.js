var fs = require("fs");
var im = require("imagemagick");
var request = require("request");
var Discord = require("discord.js")

function getFiletype(filename) {
	let arr = filename.split(".");
	return arr[arr.length-1].toLowerCase();
}

module.exports = {
	msg: function(msg) {
		let is_url = (msg.content.toLowerCase().split(" ")[1] == "url"); 

		if (!msg.attachments.array()[0] && !is_url) {
			msg.channel.send("You need to attach an image. **"+global.prefix+"cas (image attachment)**");
			return;
		}

		let filename = msg.attachments.array()[0].filename;
		let filetype = getFiletype(filename); 
		let file_url = msg.attachments.array()[0].url;

		if (
			filetype != "png" &&
			filetype != "jpg" &&
			filetype != "jpeg"
		) {
			msg.channel.send("**PNG, JPG** only!");
			return;
		}

		msg.channel.startTyping();
		request({url: file_url, encoding: "binary"}, function(err, res, body) {
			if (err) {
				msg.channel.send("Error whilst downloading image!");
				msg.channel.stopTyping();
				console.log(err);
				return;
			}

			let file_dir = global.DIRNAME+"/tmp/"+filename;
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
						"-liquid-rescale", "50%",
						"-scale", "200%",
					cas_file_dir], function(err, stdout) {
						if (err) {
							msg.channel.send("Error whilst converting image!");
							msg.channel.stopTyping();
							console.log(err);
							return;
						}

						console.log(stdout);
						msg.channel.send(new Discord.Attachment(cas_file_dir));
						msg.channel.stopTyping();
					});
				}, 200);
			});
		});
	}
}