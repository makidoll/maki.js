module.exports = function(bot) {

	let express = require("express");
	let app = express();

	// app.get("/message", function(req, res) {
	// 	if (!req.query.id) { res.send("You didn't specify an ID."); return; }
	// 	if (!req.query.name) { res.send("You didn't specify a name."); return; }
	// 	if (!req.query.message) { res.send("You didn't specify a message."); return; }

	// 	let ip = (req.query.ip)? " ("+req.query.ip+")": "";

	// 	bot.fetchUser(req.query.id).then((user) => {
	// 		user.send("**"+req.query.name+ip+":** "+req.query.message);
	// 		res.send("Your message has been sent!");
	// 	}).catch(err => {
	// 		res.send("An error has occured!");
	// 	})
	// });

	app.get("/dm/get_messages", (req, res) => {
		if (!req.query.token) { res.send("You didn't send a token."); return; }
		if (!req.query.id) { res.send("You didn't specify an ID."); return; }
		if (req.query.token != global.web.token) { res.send("Invalid token!"); return; }

		bot.fetchUser(req.query.id).then(user => {

			if (!user.dmChannel) { res.send(""); return; }
			user.dmChannel.fetchMessages({limit:50}).then(messages => {

				let out = [];
				messages.array().forEach((msg, i) => {
					out.push(msg.author.username+": "+msg.content);
				});

				res.send(out);

			}).catch(err => {
				res.send("error: "+err);
			});

		}).catch(err => {
			res.send("error: "+err);
		})
	});

	app.post("/dm/send_message", (req, res) => {
		if (!req.query.token) { res.send("You didn't send a token."); return; }
		if (!req.query.id) { res.send("You didn't specify an ID."); return; }
		if (!req.query.message) { res.send("You didn't specify a message."); return; }
		if (req.query.token != global.web.token) { res.send("Invalid token!"); return; }

		bot.fetchUser(req.query.id).then(user => {

			user.send(req.query.message);
			res.send('"'+req.query.message+'" sent to '+user.username+'!');

		}).catch(err => {
			res.send("error: "+err);
		})
	});

	app.listen(global.web.port, () => {
		global.log("Web server open at *:"+global.web.port);
	}); 

}