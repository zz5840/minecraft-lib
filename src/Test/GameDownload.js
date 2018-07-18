const GameDownload = require('../Game/GameDownload');

let gd = new GameDownload('1.12.2');
gd.downloadJSON().then(() => {
	return gd.downloadClientJar();
}).catch(err => {
	console.log(err);
});