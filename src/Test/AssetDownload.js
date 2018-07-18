const AssetDownload = require('../Asset/AssetDownload');

let ad = new AssetDownload('1.12.2');
ad.downloadJSON().then(() => {
	return ad.downloadAsset();
}).catch(err => {
	console.log(err);
});