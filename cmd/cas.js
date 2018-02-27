var fs = require("fs");
var im = require("imagemagick");
var request = require("request");

function getFiletype(filename) {
	let arr = filename.split(".");
	return arr[arr.length-1].toLowerCase();
}

module.exports = {
	msg: function(msg) {
		if (!msg.attachments.array()[0]) {
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
		request(file_url, function(err, res, body) {
			console.log("Downloading... "+file_url);
			let file_dir = global.DIRNAME+"/tmp/"+filename;
			fs.writeFile(file_dir, body, "binary", function(err) {
				if (err) {
					msg.channel.send("Error whilst retrieving image!");
					msg.channel.stopTyping();
					console.log(err);
					return;
				}

				let cas_file_dir = file_dir+"_cas."+filetype;
				setTimeout(function() {
					im.convert([file_dir, "-scale 10%", cas_file_dir], function(err, stdout) {
						if (err) {
							msg.channel.send("Error whilst converting image!");
							msg.channel.stopTyping();
							console.log(err);
							return;
						}

						console.log(stdout);
						msg.channel.send(fs.readFileSync(cas_file_dir));
					});
				}, 200);
			});
		});
	}
}