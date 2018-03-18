var fs = require("fs");

module.exports = function() {
	let now = new Date();
	let night = new Date(
		now.getFullYear(), now.getMonth(), now.getDate(),
		global.backup.time[0], global.backup.time[1], global.backup.time[2]
	);
	let update = night.getTime() - now.getTime(); // milliseconds

	if (Math.sign(update) == -1) {
		night = new Date(
			now.getFullYear(), now.getMonth(), now.getDate() + 1,
			global.backup.time[0], global.backup.time[1], global.backup.time[2]
		); 
		update = night.getTime() - now.getTime(); // milliseconds
	}

	global.log("Next backup shall be made at: "+
		global.pZ(global.backup.time[0], 2)+":"+
		global.pZ(global.backup.time[1], 2)+":"+
		global.pZ(global.backup.time[2], 2)+" ("+global.backup.dir+")"
	);

	setTimeout(function() {
		fs.writeFileSync(global.backup.dir+"/users_"+moment().format("DD-MM-YY")+".json", fs.readFileSync(global.DIRNAME+"/users.json"));
		global.log("Backup successfully made in: "+global.backup.dir+"/users_"+moment().format("DD-MM-YY")+".json");
		module.exports();
	}, update);
}