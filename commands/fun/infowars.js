var fs = require("fs");
var svgImg = require("svg2img");
var requests = require("sync-request");
var Discord = require("discord.js");
var Datauri = require("datauri");
var datauri = new Datauri();
var imageSize = require("image-size");

function getFiletype(filename) {
	let arr = filename.split(".");
	return arr[arr.length-1].toLowerCase();
}

module.exports = function(msg) {
	let args = msg.content.slice(global.prefix.length+"infowars ".length).split(",");

	let title = args[0];
	args.shift();
	let caption = args.join(",").trim();

	if (!msg.attachments.array()[0] || !title || !caption) {
		msg.channel.send(
			"You need to feed me arguments!\n**"+global.prefix+"infowars [title], [caption]        [attached image]**"
		);
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
		msg.channel.send("**PNG and JPG** only!");
		return;
	}

	msg.channel.startTyping();
	let image = requests("GET", file_url).getBody();
	let dimensions = imageSize(image);
	let height = dimensions.height * (985/dimensions.width);

	svg = fs.readFileSync(global.__dirname+"/svg/infowars.svg", "utf8")
		.replace(/\[title\]/g, title.toUpperCase())
		.replace(/\[caption\]/g, caption.toUpperCase())
		.replace(/\[name\]/g, msg.author.username.toUpperCase())
		.replace(/\[website\]/g, msg.author.username.toUpperCase()+".COM/SHOW")
		.replace(/\[height\]/g, height)
		.replace(/\[caption-height\]/g, height-155)
		.replace(/\[image\]/g, datauri.format(".png", image).content)

	svgImg(svg, function(err, buffer) {
		if (err) {
			console.log(err);
			msg.channel.send("An error has occurred!");
			msg.channel.stopTyping();
			return;
		}

		msg.channel.send(new Discord.Attachment(buffer));
		msg.channel.stopTyping();
		global.db.exec("UPDATE stats SET value = value + 1 WHERE key = 'infowars';");
	});
}