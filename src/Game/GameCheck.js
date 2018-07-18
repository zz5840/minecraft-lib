const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');

const ReadJSON = require('../Util/ReadJSON');
const checker = require('../Util/FileChecker');

class GameCheck {
	constructor (version) {
		this.version = version;
	}

	checkJSON () {
		return new Promise((resolve, reject) => {
			fs.pathExists(path.join(__game.version(this.version), this.version + '.json')).then((data) => {
				resolve(data);
			}).catch(() => {
				resolve(reject);
			});
		});
	}

	checkClientJar () {
		return new Promise((resolve, reject) => {
			ReadJSON.version(this.version).then(data => {
				return checker([{
					path: path.join(__game.version(this.version), this.version + '.jar'),
					hash: data.downloads.client.sha1
				}], false);
			}).then(data => {
				resolve(data[0]);
			}).catch(reject);
		})
	}
}

module.exports = GameCheck;