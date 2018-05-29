///<reference path="index.d.ts"/>

import config from './config';
import * as path from "path";
import GameDownload from "./Game/GameDownload";

global.__root = path.join(__dirname, '..');
global.__download = path.join(__dirname, '../download');
global.__game = {
	root: path.join(__dirname, '../minecraft'),
	versions: null
};
Object.assign(__game, {
	versions: path.join(__game.root, 'versions')
});


let d = new GameDownload('1.12.2', '1.12.2', config.downloadSource);

d.loadVersionInfo().then(function () {
	return d.downloadJson();
});
