var moment = require("moment");

function addS(name) { return (name.slice(-1).toLowerCase() == "s")? name+"'": name+"'s"; }

module.exports = function(msg) {
	// get users jail
	let user = msg.author;
	if (msg.mentions.users.array()[0]) {
		user = msg.mentions.users.array()[0];
	}

	let jail = global.db.prepare("SELECT jail FROM users WHERE id = '"+user.id+"';").get();
	jail = (jail)? JSON.parse(jail.jail): {};

	if (!jail) return msg.channel.send("**"+addS(user.username)+" Jail** is empty!");
	if (!jail.people) return msg.channel.send("**"+addS(user.username)+" Jail** is empty!");

	// print jail
	let type = "";
	if (jail.type) type = " "+jail.type.substring(0,1).toUpperCase()+jail.type.slice(1);

	let out = "**"+addS(user.username)+type+" Jail**\n\n";

	jail.people.forEach((person,i)=>{
		person.reason = person.reason+((person.reason.slice(-1)==".")?"":".");
		person.reason = person.reason.substring(0,1).toUpperCase()+person.reason.slice(1);

		out += (
			((i%2)? ":small_orange_diamond:": ":small_blue_diamond:")+
			" **"+person.name+" ("+moment(person.date).format("Do MMM 'YY")+
			")**: "+person.reason+"\n"
		);
	});

	msg.channel.send(out);
}