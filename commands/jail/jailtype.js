var syntax = global.prefix+"jailtype (type of jail)";

function addS(name) { return (name.slice(-1).toLowerCase() == "s")? name+"'": name+"'s"; }

module.exports = function(msg) {
	let type = msg.content.slice((global.prefix+"jailtype ").length);

	// print type
	if (!type) {
		let jail = global.db.prepare("SELECT jail FROM users WHERE id = '"+msg.author.id+"';").get();
		jail = (jail)? JSON.parse(jail.jail): {};
		if (!jail.type) return msg.channel.send("You don't have a type set for your jail. Try **"+syntax+"**");
		return msg.channel.send("You have a **"+jail.type+"** type of jail. Try **"+syntax+"**");
	}

	// change type
	let jail = global.db.prepare("SELECT jail FROM users WHERE id = '"+msg.author.id+"';").get().jail;
	jail = (jail)? JSON.parse(jail): {};

	if (jail.type) {
		msg.channel.send("You changed your jail from a **"+jail.type+"** to a **"+type+"** type of jail.");
	} else {
		msg.channel.send("You changed your jail to a **"+type+"** type of jail.");
	}

	jail.type = type;
	global.db.prepare("UPDATE users SET jail = ? WHERE id = ?;").run(JSON.stringify(jail), msg.author.id);
}