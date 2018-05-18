var Database = require("better-sqlite3");
var db = new Database("./test.db");

db.exec("CREATE TABLE IF NOT EXISTS test (random INTEGER);");

for (var i = 0; i < 100; i++) {
	let randInt = Math.floor(Math.random()*1000);
	db.prepare("INSERT INTO test (random) VALUES (?);").run(randInt);
	console.log("Added: "+randInt)
}

db.close();