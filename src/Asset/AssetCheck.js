const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');

const ReadJSON = require('../Util/ReadJSON');
const checker = require('../Util/FileChecker');

class AssetCheck {
	constructor (version) {
		this.version = version;
	}

	checkJSON () {
		return new Promise((resolve, reject) => {
			ReadJSON.versionAsset(this.version).then((data) => {
				return fs.pathExists(path.join(__game.assets, 'indexes', data.id + '.json'));
			}).then((data) => {
				resolve(data);
			}).catch(reject);
		});
	}

	checkAsset () {
		return new Promise((resolve, reject) => {
			ReadJSON.asset(this.version).then(data => {
				let fileList = [];
				_.each(data, v => {
					fileList.push({
						path: __game.asset(v.hash),
						hash: v.hash
					})
				});
				checker(fileList).then(data => {
					resolve(data);
				}).catch(reject);
			})
		})
	}
}

module.exports = AssetCheck;