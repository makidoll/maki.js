<img height="110" width="400" src="https://i.imgur.com/HcYFflq.png">

> 🎮 My terrible Discord bot.

## Installation

**Dependencies:**

- Linux (Windows isn't going to work sorry. Issues with `svg2img` and `imagemagick`)
- https://github.com/Automattic/node-canvas#installation
- Google Font: Roboto `pacman -Sy ttf-roboto`
- ImageMagick

Suspecting you're using Linux:

```sh
git clone https://gitlab.com/makitty/maki.js
cd maki.js
npm install
cp settings.example.js settings.js
cp users.example.json users.json
```
Edit `settings.js` and set the tokens.

- **Discord:** https://discordapp.com/developers/applications/me
- **Osu!:** https://osu.ppy.sh/p/api

Finally, I recommend you use [PM2](https://www.npmjs.com/package/pm2) to start the bot indefinitely:

```sh
pm2 start app.js --name "Maki.js"
```
...or just run it straight off of Node.js:

```sh
node app.js
```
## Contribute

Feel free to fork or send pull requests!
