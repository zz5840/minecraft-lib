const GameCheck = require('../Game/GameCheck');
let gc = new GameCheck('1.12.2');

gc.checkJSON().then(function (data) {
	console.log(data);
	return gc.checkClientJar();
}).then(data => {
	console.log(data);
}).catch(err => {
	console.log(err);
});
