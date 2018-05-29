import {DownloadSource} from "../global";
import GameVersion from "./GameVersion";
import * as download from "download";
import * as path from "path";
import GameCheck from "./GameCheck";

export default class GameDownload {
	private name: string;
	private source: DownloadSource;
	private version: string;
	private versionInfo: Game.MinecraftVersion;
	private gv: GameVersion;
	private gc: GameCheck;

	public constructor (name: string, version: string, source: DownloadSource = DownloadSource.OFFICIAL) {
		this.name = name;
		this.version = version;
		this.source = source;
		this.gv = new GameVersion();
		this.gc = new GameCheck(this.version);
	}

	public loadVersionInfo () {
		return this.gv.getVersion(this.version).then((data: Game.MinecraftVersion) => {
			this.versionInfo = data;
		});
	}

	public downloadJson () {
		return new Promise(resolve => {
			download(this.versionInfo.url, path.join(__game.versions));
		});
	}

	public downloadJar () {

	}

	public downloadLibraries () {

	}

	public downloadAssests () {

	}

	private isVersionExist (id: string) {

	}
}