var moment = require("moment");
var Database = require("better-sqlite3");

global.db = new Database(global.__dirname+"/database.db");

module.exports = {
	init: function() {
		global.db.exec("CREATE TABLE IF NOT EXISTS users ("+
			"id       TEXT UNIQUE,"+
			"username TEXT,"+
			"desc     TEXT DEFAULT '"+global.prefix+"desc',"+
			"bg       TEXT,"+
			"level    INTEGER DEFAULT 1,"+
			"xp       INTEGER DEFAULT 0,"+
			"coins    INTEGER DEFAULT 100,"+
			"oh_my    INTEGER DEFAULT 0,"+
			"waa      INTEGER DEFAULT 0,"+
			"created  DATETIME"+
		");");

		global.db.exec("CREATE TABLE IF NOT EXISTS stats ("+
			"key   TEXT UNIQUE,"+
			"value INT"+
		");");

		global.db.exec("INSERT INTO stats (key, value)"+
			"SELECT 'cas_converts', 0 "+
			"WHERE NOT EXISTS(SELECT 1 FROM stats WHERE key = 'cas_converts');");
	},

	update_user: function(user) {
		let count = global.db.prepare("SELECT COUNT(id) AS count FROM users WHERE id = ?;").get(user.id).count;

		if (count == 0) {
			// lets add the user to our system!
			global.db.prepare("INSERT INTO users (id, username, created) VALUES (?, ?, ?);").run(
				user.id, user.username, moment().format("YYYY-MM-DD HH:mm:ss"));

			return;
		}

		// update username
		global.db.prepare("UPDATE users SET username = ? WHERE id = ?;").run(user.username, user.id);
	},

	update_msg: function(msg) {
		this.update_user(msg.author);
		
		// ha, ha, ha
		if (msg.content.match(/oh my/gi)) global.db.prepare("UPDATE users SET oh_my = oh_my + 1 WHERE id = (?);").run(msg.author.id);
		if (msg.content.match(/waa/gi)) global.db.prepare("UPDATE users SET waa = waa + 1 WHERE id = (?);").run(msg.author.id);

		// xp and level
		let user = global.db.prepare("SELECT xp, level FROM users WHERE id = (?);").get(msg.author.id);
		if (user.xp >= 999) {
			global.db.prepare("UPDATE users SET xp = 0, level = level + 1 WHERE id = ?;").run(msg.author.id);
			msg.channel.send("Yay, <@"+msg.author.id+"> leveled up from **"+user.level+"** to **"+(user.level+1)+"**!");
		} else {
			global.db.prepare("UPDATE users SET xp = xp + 1 WHERE id = (?);").run(msg.author.id);
		}
	}
};