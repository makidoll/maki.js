<img height="128" src="https://raw.githubusercontent.com/makixx/maki.js/master/img/help.png">

> 🎮 My terrible Discord bot.

## Installation

Suspecting you're using Linux:
```sh
git clone https://github.com/makixx/maki.js & cd maki.js
npm install
cp settings.example.js settings.js & cp users.example.js users.js
```
Edit `settings.js` and set the tokens.

>**Discord:** https://discordapp.com/developers/applications/me

>**Osu!:** https://osu.ppy.sh/p/api

Finally, I recommend you use [PM2](https://www.npmjs.com/package/pm2) to start the bot:
```sh
pm2 start app.js --name "Maki.js"
```
...or just it straight off of Node.js:
```sh
node app.js
```
