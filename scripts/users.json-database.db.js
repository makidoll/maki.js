var sql = require("sqlite3").verbose();
var db = new sql.Database("./database.db");
var fs = require("fs");
var moment = require("moment");

var users = JSON.parse(fs.readFileSync("./users.json"));
var ids = Object.keys(users);

db.serialize(function() {

	db.run("CREATE TABLE IF NOT EXISTS users ("+
		"id       TEXT UNIQUE,"+
		"username TEXT,"+
		"desc     TEXT DEFAULT '"+global.prefix+"desc to set your description!',"+
		"level    INTEGER DEFAULT 1,"+
		"xp       INTEGER DEFAULT 0,"+
		"coins    INTEGER DEFAULT 100,"+
		"oh_my    INTEGER DEFAULT 0,"+
		"waa      INTEGER DEFAULT 0,"+
		"created  DATETIME"+
	");");

	for (var i=0; i<ids.length; i++) {
		var id = ids[i];
		var user = users[id];

		if (user.desc == "Setup a description:              !desc (text)") {
			var desc = "m!desc";
		} else { var desc = user.desc; }

		if (user.oh_my == null) {
			var oh_my = 0;
		} else { var oh_my = user.oh_my; }

		if (user.waaaa == null) {
			var waa = 0;
		} else { var waa = user.waaaa; }


		db.run("INSERT INTO users (id, username, desc, level, xp, coins, oh_my, waa, created) "+
		"VALUES((?), (?), (?), (?), (?), (?), (?), (?), (?))",
			id, user.username, desc, user.level, user.xp, 100, oh_my, waa,
			moment.unix(user.created).format("YYYY-MM-DD HH:mm:ss")
		);
	}

	db.close();

});