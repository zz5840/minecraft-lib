const downloader = require('../Util/SimpleDownloader');
const ReadJSON = require("../Util/ReadJSON");
const GameCheck = require('./GameCheck');
const downloader = require('../Util/SimpleDownloader');

class GameDownload {
	constructor (version) {
		this.version = version;
	}

	downloadJSON () {
		return new Promise((resolve, reject) => {
			let gc = new GameCheck(this.version);
			gc.checkJSON().then(exist => {
				if (exist) {
					resolve();
					return;
				}
				ReadJSON.manifestVersion(this.version).then((data) => {
					return downloader(data.url, __game.version(this.version));
				}).then(() => {
					resolve();
				}).catch(reject);
			}).catch(reject);
		});
	}

	downloadClientJar () {
		return new Promise((resolve, reject) => {
			let gc = new GameCheck(this.version);
			gc.checkClientJar().then(exist => {
				if (exist) {
					resolve();
					return;
				}
				ReadJSON.version(this.version).then((data) => {
					let downloader = downloader(data.downloads.client.url, __game.version(this.version), this.version + '.jar');
					downloader.then(() => {
						resolve();
					});
					downloader.onProgress(progress => {
						console.log(progress); //TODO
					})
				}).catch(reject);
			});

		});
	}
}

module.exports = GameDownload;