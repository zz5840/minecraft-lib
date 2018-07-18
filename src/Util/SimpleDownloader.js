const fs = require('fs-extra');
const path = require('path');
const request = require('request');
const requestProgress = require('request-progress');
const PProgress = require('p-progress');

function downloader (src, dest, name) {
	return new PProgress((resolve, reject, progress) => {
		if (typeof name === 'undefined') name = path.parse(src).base;
		console.log(`download file [${src}] to [${path.join(dest, name)}]`);
		fs.ensureDir(dest).then(() => {
			requestProgress(request(src)
				.on('progress', (state) => {
					progress(state);
				}).on('error', (err) => {
					reject(err);
				}).on('end', () => {
					resolve();
				})).pipe(fs.createWriteStream(path.join(dest, name)));
		});
	})

}

module.exports = downloader;