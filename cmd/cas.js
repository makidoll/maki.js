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

		console.log(filetype);

		if (
			filetype != "png" &&
			filetype != "jpg" &&
			filetype != "jpeg"
		) {
			msg.channel.send("**PNG, JPG** only!");
			return;
		}

		// request(image_url, function(err, res, body) {

		// });
	}
}