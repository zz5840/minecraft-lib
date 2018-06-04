///<reference path="index.d.ts"/>

import config from './config';
import * as path from "path";
import GameDownload from "./Game/GameDownload";
import GameCheck from "./Game/GameCheck";
import DownloaderMain from "./Downloader/DownloaderMain";
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
let d = new DownloaderMain(list, 32);
let status = new Array(32 + 1).fill('no task');
let bar = new ProgressBarFormatter();
d.event.on('progress', function (thread: number, index: number, state: Downloader.DownloadProgress) {
	status[thread] = `Thread:${thread + 1} Name:${d.getTask(index).name} ${bar.format(state.percent)} ${(state.percent * 100).toFixed(2)}%`;
	logUpdate(status.join("\n"));
});
d.event.on('end', function () {
	console.log('done');
	logUpdate.clear();
	let end = new Date().getTime();
	console.log('use time: ' + (end - start) / 1000 + 's')
});
d.event.on('done', function (thread, index) {
	let percent = d.getDoneNum() / list.length;
	status[32] = `Total: ${bar.format(percent)} ${(percent * 100).toFixed(2)}%`;
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
