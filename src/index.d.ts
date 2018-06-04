declare module 'request-promise-native';
declare module 'request-progress';
declare module 'log-update';
declare module 'progress-bar-formatter';

declare var __root: string;
declare var __download: string;
declare var __game: NodeJS.RootPath;

declare namespace NodeJS {
	export interface Global {
		__root: string,
		__download: string,
		__game: RootPath
	}

	interface RootPath {
		root: string,
		versions: string,
		assets: string
	}
}

declare namespace Game {
	interface MinecraftVersions {
		latest: {
			release: string,
			snapshot: string
		},
		versions: Array<MinecraftVersion>
	}

	interface MinecraftVersion {
		id: string,
		type: string,
		time: string,
		releaseTime: string,
		url: string
	}

	interface AssetsIndex {
		objects: {
			[key: string]: {
				hash: string,
				size: number
			}
		}
	}
}

declare namespace Downloader {
	interface DownloadListTask {
		name: string,
		url: string,
		dest: string
	}

	interface DownloadProgress {
		percent: number,            // Overall percent (between 0 to 1)
		speed: number,              // The download speed in bytes/sec
		size: {
			total: number,          // The total payload size in bytes
			transferred: number     // The transferred payload size in bytes
		},
		time: {
			elapsed: number,        // The total elapsed seconds since the start (3 decimals)
			remaining: number       // The remaining seconds to finish (3 decimals)
		}
	}
}