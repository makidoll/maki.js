module.exports = function(bot) {

	let express = require("express");
	let app = express();

	app.get("/message", function(req, res) {
		if (!req.query.id) { res.send("You didn't specify an ID."); return; }
		if (!req.query.name) { res.send("You didn't specify a name."); return; }
		if (!req.query.message) { res.send("You didn't specify a message."); return; }

		bot.fetchUser(req.query.id).then((user) => {
			user.send("**"+req.query.name+" said:** "+req.query.message);
			res.send("Your message has been sent!");
		}).catch(err => {
			res.send("An error has occured!");
		})
	});


	app.listen(global.port, () => {
		global.log("Web server open at *:"+global.port);
	}); 

}