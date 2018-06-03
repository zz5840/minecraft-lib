import {DownloadSource} from "../global";
import GameVersion from "./GameVersion";
import * as download from "download";
import * as path from "path";
import GameCheck from "./GameCheck";

export default class GameDownload {
	private name: string;
	private source: DownloadSource;
	private readonly version: string;
	private versionInfo: Game.MinecraftVersion;
	private gv: GameVersion;
	private gc: GameCheck;

	public constructor (name: string, version: string, source: DownloadSource = DownloadSource.Official) {
		this.name = name;
		this.version = version;
		this.source = source;
		this.gv = new GameVersion();
		this.gc = new GameCheck(this.version);
	}

	public setSource (source: DownloadSource) {
		this.source = source;
	}

	public downloadJson () {
		return new Promise(resolve => {
			download(this.versionInfo.url, path.join(__game.versions, this.version, ''));
		});
	}

	public downloadJar () {
		return new Promise(resolve => {
			console.log(this.versionInfo);
		})
	}

	public downloadLibraries () {

	}

	public downloadAssests () {

	}

	public loadVersionInfo () {
		return this.gv.getVersion(this.version).then((data: Game.MinecraftVersion) => {
			this.versionInfo = data;
		});
	}
}