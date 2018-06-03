declare module 'request-promise-native';

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
}