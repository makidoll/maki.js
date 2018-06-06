var fs = require("fs");
var request = require("request");
var Discord = require("discord.js");
const { spawn } = require("child_process");

function getFilenameFromUrl(url) {
	let arr = url.split("/");
	return arr[arr.length-1].toLowerCase();
}

function getFiletype(filename) {
	let arr = filename.split(".");
	return arr[arr.length-1].toLowerCase();
}

function child(cmd, args, fClose) {
	const c = spawn(cmd, args);
	c.on("close", fClose);
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
		msg.channel.send("You need to attach an image. **"+global.prefix+"hoh (url or image)**");
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
		filetype != "jpeg"
   	   ) {
		msg.channel.send("**PNG and JPG** only!");
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

			child("convert", [file_dir, "-gravity", "East", "-chop", "50%x0", file_dir+"_l."+filetype], (close) => {
				if (close != 0) {
					msg.channel.send("Error whilst converting image!");
					msg.channel.stopTyping();
					global.log(err);
					return;
				}

				child("convert", [file_dir+"_l."+filetype, "-flop", file_dir+"_r."+filetype], (close) => {
					if (close != 0) {
						msg.channel.send("Error whilst converting image!");
						msg.channel.stopTyping();
						global.log(err);
						return;
					}

					child("montage", [file_dir+"_l."+filetype, file_dir+"_r."+filetype, 
						"-geometry", "+0+0", "-background", "none", file_dir+"_hoh."+filetype], (close) => {
						if (close != 0) {
							msg.channel.send("Error whilst converting image!");
							msg.channel.stopTyping();
							global.log(err);
							return;
						}

						msg.channel.send(new Discord.Attachment(file_dir+"_hoh."+filetype));
						msg.channel.stopTyping();

						global.db.exec("UPDATE stats SET value = value + 1 WHERE key = 'hoh';");
					}); // holy
				}); // fucking
			}); // shit
			// classic js callback hell

		}); // ahem fs write the users file
	}); // request() DOWNLOADING THE FILE
}