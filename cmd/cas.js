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

		request(file_url, function(err, res, body) {
			let file_dir = global.__dirname+"/tmp/"+filename;
			fs.writeFile(file_dir, body, function(err) {
				if (err) {
					msg.channel.send("Error whilst retrieving image!");
					return
				}

				let cas_file_dir = file_dir+"_cas."+filetype;
				im.convert([file_dir, "-scale 10%", cas_file_dir], function(err, stdout) {
					console.log(stdout);
					msg.channel.send(fs.readFileSync(cas_file_dir));

				});
			});
		});
	}
}