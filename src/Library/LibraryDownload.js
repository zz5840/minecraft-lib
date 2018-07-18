const os = require('../Util/OS');
const path = require('path');
const arch = require('arch');
const _ = require('lodash');

const ReadJSON = require('../Util/ReadJSON');
const MultiThreadDownloader = require('../Util/MultiThreadDownloader');

class LibraryDownload {

	constructor (version) {
		this.version = version;
		this.arch = arch().substr(1, 2);
	}

	downloadLibrary () {
		console.log(this);
		return new Promise((resolve, reject) => {
			ReadJSON.version(this.version).then(data => {
				let taskList = [];
				_.each(data.libraries, val => {
					// 事实证明wiki.vg是错的 1.12.2中有一个name为net.java.jinput:jinput-platform:2.0.5，然而根据wiki上所说的方法拼接出来的url返回了404，所以只用下载artifact中的文件就行了
					if (val.downloads.artifact) {
						let { base, dir } = path.parse(val.downloads.artifact.path);
						taskList.push({
							url: val.downloads.artifact.url,
							name: base,
							dest: path.join(__game.libraries, dir)
						});
					}
					let platform = 'natives-' + os();
					if (val.downloads.classifiers && val.downloads.classifiers[platform]) {
						let { base, dir } = path.parse(val.downloads.classifiers[platform].path);
						taskList.push({
							url: val.downloads.classifiers[platform].url,
							name: base,
							dest: path.join(__game.libraries, dir)
						});
					}
				});
				let downloader = new MultiThreadDownloader(taskList);
				downloader.event.on('progress', function () {
					console.log(arguments); //TODO
				}).on('end', () => {
					resolve();
				}).on('error', (thread, index, err) => {
					reject(err);
				});
				downloader.start();
			}).catch(reject);
		});
	}
}

module.exports = LibraryDownload;