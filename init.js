var fs = require("fs");

function exampleCopy(file, example) {
	if (!fs.existsSync(global.DIRNAME+"/"+file)) {
		fs.writeFileSync(global.DIRNAME+"/"+file, example);
		global.log("Successfully created new "+file+" file.");
	}
}

module.exports = function() {
	exampleCopy("users.json", JSON.stringify({}));
}