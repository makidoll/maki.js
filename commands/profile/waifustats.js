var fs = require("fs");
var svg = require("svg2img");

module.exports = function(msg) {
	// get waifus {id: amount, ...}
	let waifus_obj = {};
	global.db.prepare("SELECT waifu, id FROM users WHERE waifu IS NOT NULL;").all().forEach((user, i) => {

		JSON.parse(user.waifu).forEach((waifu, i) => {
			waifus_obj[waifu] = (waifus_obj[waifu])? waifus_obj[waifu]+1: 1;
		});

	});

	// change to [{id, stat}, ...]
	let waifus = [];
	Object.keys(waifus_obj).forEach((id, i) => {
		waifus[i] = {
			id: id,
			stat: waifus_obj[id]
		}
	});

	// sort and limit to 8
	waifus.sort((a,b)=>{return b.stat-a.stat});
	waifus = waifus.splice(0,8);

	// generate svg!
	let svg_data = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300" style="background:#1d1f21;">';
	let highest = waifus[0].stat;
	waifus.forEach((waifu, i) => {
		let avatar = global.__dirname+"/cache/avatars/"+waifu.id+".png";
		let height = Math.round(waifu.stat/highest*220);
		let x = i*50;

		svg_data += 
			'<clipPath id="waifu-'+i+'">    <rect width="30" height="'+(height+25)+'" x="'+(x+10)+'" y="'+(250-height)+'" rx="8" ry="8"/></clipPath>'+
			'<rect  clip-path="url(#waifu-'+i+')" width="30" height="'+(height+25)+'" x="'+(x+10)+'" y="'+(250-height)+'" fill="#36393e"/>'+
			'<image clip-path="url(#waifu-'+i+')" width="30" height="'+(height+25)+'" x="'+(x+10)+'" y="'+(250-height)+'" preserveAspectRatio="xMidYMin slice" href="'+avatar+'"/>'+
			'<rect  clip-path="url(#waifu-'+i+')" width="30" height="'+(height+25)+'" x="'+(x+10)+'" y="'+(250-height)+'" fill="rgba(0,0,0,0.6)"/>'+
			
			'<clipPath id="waifu-avatar-'+i+'">'+
			'<circle r="22.5" cx="'+(x+25)+'" cy="275"/></clipPath>'+
			'<circle r="22.5" cx="'+(x+25)+'" cy="275" fill="#36393e"/>'+
			'<image clip-path="url(#waifu-avatar-'+i+')" width="45" height="45" x="'+(x+2.5)+'" y="252.5" preserveAspectRatio="none" href="'+avatar+'"/>'+
			
			'<text font-family="Roboto" x="'+(x+25)+'" y="'+(240-height)+'" font-size="24" text-anchor="middle" fill="#ffffff">'+waifu.stat+'</text>';
	});
	svg_data += "</svg>";

	// make svg
	msg.channel.startTyping();
	svg(svg_data, function(err, buffer) {
		if (err) {
			msg.channel.stopTyping();
			msg.channel.send("An error has occured!");
			console.log(err);
			return;
		}

		msg.channel.send("", { files: [{ attachment: new Buffer(buffer) }] });
		msg.channel.stopTyping();
	});
}