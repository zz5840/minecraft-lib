///<reference path="index.d.ts"/>

import config from './config';
import * as path from "path";
import GameDownload from "./Game/GameDownload";
import GameCheck from "./Game/GameCheck";
import DownloaderMultiThread from "./Downloader/DownloaderMultiThread";
import * as _ from 'lodash';
import * as logUpdate from 'log-update';
import * as ProgressBarFormatter from 'progress-bar-formatter';

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

let a: Array<Downloader.DownloadListTask> = [{
	url: 'https://launcher.mojang.com/mc/game/1.12.2/client/0f275bc1547d01fa5f56ba34bdc87d981ee12daf/client.jar',
	name: 'client.jar',
	dest: __download
}, {
	url: 'https://launcher.mojang.com/mc/game/1.12.2/client/0f275bc1547d01fa5f56ba34bdc87d981ee12daf/client.jar',
	name: 'client1.jar',
	dest: __download
}, {
	url: 'https://launcher.mojang.com/mc/game/1.12.2/client/0f275bc1547d01fa5f56ba34bdc87d981ee12daf/client.jar',
	name: 'client2.jar',
	dest: __download
}, {
	url: 'https://launcher.mojang.com/mc/game/1.12.2/client/0f275bc1547d01fa5f56ba34bdc87d981ee12daf/client.jar',
	name: 'client3.jar',
	dest: __download
}];
let bar = new ProgressBarFormatter();
let threadNum = 2;
let d = new DownloaderMultiThread(a, threadNum);
let status = new Array(threadNum + 1).fill('no task');
status[threadNum] = `Total: ${bar.format(0)} 0%`;

d.event.on('progress', (thread: number, index: number, state: Downloader.DownloadProgress) => {
	status[thread] = `Thread:${thread + 1} Name:${d.getTask(index).name} ${bar.format(state.percent)} ${(state.percent * 100).toFixed(2)}% ${(state.speed / 1024 / 1024).toFixed(2)}MB/s`;
	logUpdate(status.join("\n"));
});
d.event.on('end', () => {
	console.log('download finished');
	// logUpdate.clear();
	let end = new Date().getTime();
	console.log('use time: ' + (end - start) / 1000 + 's');
});
d.event.on('done', (thread, index) => {
	status[threadNum] = `Total: ${bar.format(d.getProgressPercent())} ${(d.getProgressPercent() * 100).toFixed(2)}%`;
});
let start = new Date().getTime();
console.log('download started');
d.start();

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
