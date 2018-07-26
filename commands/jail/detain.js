var syntax = global.prefix+"detain (@mention) (reason)";
var moment = require("moment");

function addS(name) { return (name.slice(-1).toLowerCase() == "s")? name+"'": name+"'s"; }

module.exports = function(msg) {
	// get message and mention
	if (msg.mentions.users.array()[0]==null) {
		msg.channel.send("You didn't pick anyone to jail. Try **"+syntax+"**");
		return;
	}; let user = msg.mentions.users.array()[0];

	// load their jail
	let jail = global.db.prepare("SELECT jail FROM users WHERE id = '"+msg.author.id+"';").get();
	jail = (jail)? JSON.parse(jail.jail): {};

	// check if already jailed
	if (!jail.people) jail.people = {};
	for (var i = 0; i < jail.people.length; i++) {
		if (jail.people[i].id == user.id) {
			jail.people[i].username = user.username;

			msg.channel.send("You have already jailed **"+jail.people[i].username+
				"** for **"+jail.people[i].reason+
				"** on the **"+moment(jail.people[i].date).format("Do MMM 'YY, HH:mm")+
				"**"
			);

			global.db.prepare("UPDATE users SET jail = ? WHERE id = ?;").run(JSON.stringify(jail), msg.author.id);
			return;
		}
	}

	// check if reason is specified
	//m!detain <@118352870159417350> my reason
	let reason = msg.content
	.replace(/<@(.*?)>/gi, "")
	.substring(
		global.prefix.length+
		"detain".length
	).trim();

	if (!reason) {
		msg.channel.send("You didn't select a reason. Try **"+syntax+"**");
		return;
	}

	// add to jail
	jail.people.push({
		id: user.id,
		name: user.username,
		date: moment().format("YYYY-MM-DD HH:mm:ss"),
		reason: reason,
	});

	let type = "";
	if (jail.type) type = " "+jail.type.substring(0,1).toUpperCase()+jail.type.slice(1);

	global.db.prepare("UPDATE users SET jail = ? WHERE id = ?;").run(JSON.stringify(jail), msg.author.id);
	msg.channel.send("**"+user.username+"** has been admitted to **"+addS(msg.author.username)+type+" Jail** for **"+reason+"**");
}