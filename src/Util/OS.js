const os = require('os');

module.exports = function () {
	let platform = os.platform();
	return platform === 'win32' ? 'windows' :
		(platform === 'darwin' ? 'osx' : 'linux')
};