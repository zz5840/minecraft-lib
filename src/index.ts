///<reference path="index.d.ts"/>

import config from './config';
import * as path from "path";
import GameDownload from "./Game/GameDownload";
import GameCheck from "./Game/GameCheck";
import DownloaderMain from "./Downloader/DownloaderMain";
import * as _ from 'lodash';

global.__root = path.join(__dirname, '..');
global.__download = path.join(__dirname, '../download');
global.__game = {
	root: path.join(__dirname, '../minecraft'),
	versions: null,
	assets: null
};
Object.assign(__game, {
	versions: path.join(__game.root, 'versions'),
	assets: path.join(__game.root, 'assets')
});

let index = require('../download/1.12.json');
let list: Array<Downloader.DownloadListTask> = [];
_.forEach(index.objects, function (value, key) {
	list.push({
		name: value.hash,
		url: `http://resources.download.minecraft.net/${value.hash.substr(0, 2)}/${value.hash}`,
		dest: path.join(__game.assets, 'objects', value.hash.substr(0, 2))
	})
});
let d = new DownloaderMain(list, 32);
d.event.on('progress', function (thread, done, total) {
	console.log({
		thread,
		done,
		total
	});
});
d.event.on('done', function () {
	console.log('done');
	let end = new Date().getTime();
	console.log('use time: ' + (end - start) / 1000 + 's')
});
d.start();
let start = new Date().getTime();

/*let d = new GameDownload('1.12.2', '1.12.2', config.downloadSource);

d.loadVersionInfo().then(function () {
	return d.downloadJson();
}).then(function (data) {
	console.log(data);
});*/

/*
let c = new GameCheck('1.12.2');
c.checkVersionJson().then(function (data) {
	console.log(data);
});*/
