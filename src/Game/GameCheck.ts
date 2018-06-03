import * as fs from "fs-extra";
import * as path from "path";

export default class GameCheck {
	private readonly version: string;

	constructor (version: string) {
		this.version = version;
	}

	checkVersionJson (): Promise<boolean> {
		let version = this.version;
		return new Promise<boolean>(resolve => {
			fs.stat(path.join(__game.versions, version, `${version}.json`)).then((data: any) => {
				resolve(true);
			}).catch(err => {
				resolve(false);
			})
		})
	}

	checkVersionJar () {
		let version = this.version;
		return new Promise<boolean>(resolve => {
			fs.stat(path.join(__game.versions, version, `${version}.jar`)).then((data: any) => {
				resolve(true);
			}).catch(err => {
				resolve(false);
			})
		})
	}

	checkLibraries () {

	}

	checkAssesets () {

	}
}