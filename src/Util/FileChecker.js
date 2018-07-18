const hasha = require('hasha');
const pAll = require('p-all');

/**
 * check does the file exist and the hash correspond
 * @param {Array<{path:string,hash:string,algorithm:string=sha1}>} fileList
 * @param {boolean} filter  if return a filtered array
 * @param {number}  concurrency
 * @return {Promise<any>}
 */
function checker (fileList, filter = true, concurrency = 64) {
	return new Promise((resolve, reject) => {
		let taskList = fileList.map(v => () => checkerTask(v.path, v.hash, v.algorithm || 'sha1'));
		pAll(taskList, { concurrency }).then(data => {
			resolve(filter ? filterList(fileList, data) : data);
		}).catch(reject);
	});
}

function filterList (list, data) {
	return list.filter((v, i) => !data[i]);
}

function checkerTask (file, target, algorithm = 'sha1') {
	return new Promise(resolve => {
		hasha.fromFile(file, { algorithm }).then(hash => {
			resolve(hash === target);
		}).catch(() => {
			resolve(false);
		});
	})
}

module.exports = checker;