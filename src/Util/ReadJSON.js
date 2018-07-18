let fs = require('fs-extra');
let _ = require('lodash');
let path = require('path');

class ReadJSON {
	static manifest () {
		return new Promise((resolve, reject) => {
			fs.readJSON(path.join(__download, 'version_manifest.json')).then(data => {
				resolve(data);
			}).catch(reject)
		});
	}

	static manifestVersion (version) {
		return new Promise((resolve, reject) => {
			ReadJSON.manifest().then(data => {
				let info = data.versions.find(v => v.id === version);
				if (typeof info === 'undefined') reject(new Error('no such version'));
				else resolve(info);
			}).catch(reject);
		})
	}

	static version (version) {
		return new Promise((resolve, reject) => {
			fs.readJSON(path.join(__game.version(version), version + '.json')).then(data => {
				resolve(data);
			}).catch(reject);
		});
	}

	static versionAsset (version) {
		return new Promise((resolve, reject) => {
			ReadJSON.version(version).then(data => {
				resolve(data.assetIndex);
			}).catch(reject);
		});
	}

	static asset (version) {
		return new Promise((resolve, reject) => {
			ReadJSON.versionAsset(version).then(data => {
				return fs.readJSON(path.join(__game.assets, 'indexes', data.id + '.json'))
			}).then(data => {
				resolve(data.objects);
			}).catch(reject);
		})
	}
}

module.exports = ReadJSON;