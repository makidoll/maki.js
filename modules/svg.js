const puppeteer = require("puppeteer");
const fs = require("fs");

module.exports = {
	render: (html, width, height)=>{
		return new Promise(async (resolve,reject) => {
			const browser = await puppeteer.launch({args: ["--no-sandbox"]});
			const page = await browser.newPage();

			await page.setContent(
				"<style>*{margin:0;}</style>"+html
			);

			await page.screenshot({
				omitBackground: true,
				clip: {
					x: 0, y: 0,
					width: width,
					height: height
				}
			}).then(buffer=>{
				resolve(buffer);
			});

			await browser.close();
		});
	}
}