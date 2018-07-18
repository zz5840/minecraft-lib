let path = require('path');

global.__root = path.join(__dirname, '..');
global.__download = path.join(__dirname, '../download');
global.__game = {
	root: path.join(__dirname, '../minecraft'),
};

Object.assign(__game, {
	versions: path.join(__game.root, 'versions'),
	version (v) {
		return path.join(this.versions, v);
	},
	assets: path.join(__game.root, 'assets'),
	asset (name) {
		return path.join(this.assets, 'objects', name.substr(0, 2), name);
	},
	libraries: path.join(__game.root, 'libraries')
})
;