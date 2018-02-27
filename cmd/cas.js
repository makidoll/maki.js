var im = require("imagemagick");

module.exports = {
	msg: function(msg) {
		let image_filename = msg.attachments.array()[0].filename;
		let image_url = msg.attachments.array()[0].url;

		console.log(image_filename, image_url);
	}
}