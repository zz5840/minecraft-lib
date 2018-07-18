const path = require('path');
const _ = require('lodash');

const ReadJSON = require("../Util/ReadJSON");
const AssetCheck = require('./AssetCheck');
const MultiThreadDownloader = require('../Util/MultiThreadDownloader');
const downloader = require('../Util/SimpleDownloader');

class AssetDownload {

	constructor (version) {
		this.version = version;
	}

	downloadJSON () {
		return new Promise((resolve, reject) => {
			let ac = new AssetCheck(this.version);
			ac.checkJSON().then(exist => {
				if (exist) {
					resolve();
					return;
				}
				ReadJSON.versionAsset(this.version).then((data) => {
					return downloader(data.url, path.join(__game.assets, 'indexes'));
				}).then(() => {
					resolve();
				}).catch(reject);
			})
		});
	}

	downloadAsset () {
		return new Promise((resolve, reject) => {
			let ac = new AssetCheck(this.version);
			ac.checkAsset().then(data => {
				let missingFile = [];
				_.each(data, v => {
					missingFile.push({
						name: v.hash,
						url: `http://resources.download.minecraft.net/${v.hash.substr(0, 2)}/${v.hash}`,
						dest: path.join(__game.assets, 'objects', v.hash.substr(0, 2))
					});
				});
				let downloader = new MultiThreadDownloader(missingFile);
				downloader.event.on('end', function () {
					resolve();
				});
				downloader.start();
			}).catch(reject);
		});
	}
}

module.exports = AssetDownload;