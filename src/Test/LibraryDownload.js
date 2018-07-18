const LibraryDownload = require('../Library/LibraryDownload');

let ld = new LibraryDownload('1.12.2');
ld.downloadLibrary().then(() => {
}).catch(err => {
	console.log(err);
});