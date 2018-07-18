const AssetCheck = require('../Asset/AssetCheck');
let ac = new AssetCheck('1.12.2');

ac.checkJSON().then(function (data) {
	console.log(data);
	return ac.checkAsset();
}).then(data => {
	console.log(data);
}).catch(err => {
	console.log(err);
});
