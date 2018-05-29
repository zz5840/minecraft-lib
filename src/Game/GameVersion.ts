import * as download from 'download';
import {DownloadSource} from "../global";
import * as path from "path";
import * as fs from "fs-extra";
import url from "../url";

export default class GameVersion {
	private source: DownloadSource;

	constructor () {
		this.source = DownloadSource.OFFICIAL;
	}

	/**
	 * get specified version info
	 * @param {string} id   specified game version id
	 * @returns {Promise<object>}
	 */
	public getVersion (id: string): Promise<Game.MinecraftVersion> {
		return new Promise<Game.MinecraftVersion>((resolve) => {
			this.getManifest().then((data: Game.MinecraftVersions) => {
				resolve(data.versions.filter((value: Game.MinecraftVersion) => value.id === id)[0]);
			});
		})
	}

	/**
	 * get all versions
	 * @param {string} id
	 * @returns {Promise<Array<Game.MinecraftVersion>>}
	 */
	public getAllVersions (id: string): Promise<Array<Game.MinecraftVersion>> {
		return new Promise<Array<Game.MinecraftVersion>>((resolve) => {
			this.getManifest().then((data: Game.MinecraftVersions) => {
				resolve(data.versions);
			});
		})
	}

	/**
	 * get the latest version id
	 * @param {LatestVersionsType} type?    version type (default: release)
	 * @returns {Promise<string>}
	 */
	public getLatestVersion (type: LatestVersionsType = LatestVersionsType.Release): Promise<string> {
		return new Promise<string>(resolve => {
			this.getManifest().then((data: Game.MinecraftVersions) => {
				resolve(data.latest[type]);
			});
		});
	}

	/**
	 * download version_manifest.json file
	 * @returns {Promise<void>}
	 */
	public downloadManifest (): Promise<void> {
		return new Promise<void>(() => {
			download(url[this.source].versions, __download).then(() => {
				console.log('done');
			});
		});
	}

	/**
	 * set download source
	 * @param {DownloadSource} source
	 */
	public setSource (source: DownloadSource): void {
		this.source = source;
	}

	/**
	 * read version_manifest.json file
	 * @returns {Promise<Game.MinecraftVersions>}
	 */
	private getManifest () {
		return new Promise<Game.MinecraftVersions>((resolve) => {
			fs.readFile(path.join(__download, 'version_manifest.json')).then((data: any) => {
				resolve(JSON.parse(data));
			});
		})
	}
}

export enum LatestVersionsType {
	Snapshot = 'snapshot',
	Release = 'release'
}