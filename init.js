var fs = require("fs");

function exampleCopy(file, exampleFile) {
	if (!fs.existsSync(global.DIRNAME+"/"+file)) {
		fs.copyFileSync(global.DIRNAME+"/"+exampleFile, global.DIRNAME+"/"+file);
		global.log("Successfully created new "+file+" file.");
	}
}

module.exports = function() {
	exampleCopy("user.json", "users.example.json");
}