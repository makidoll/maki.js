<img height="110" width="400" src="https://i.imgur.com/HcYFflq.png">

> 🎮 My terrible Discord bot.

## Installation

Firstly, install the dependencies for https://github.com/Automattic/node-canvas

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
...or just run it straight off of Node.js:

```sh
node app.js
```
## Contribute

Feel free to fork or send pull requests! I originally didn't want to upload this to Github but *mommy told me to...*
