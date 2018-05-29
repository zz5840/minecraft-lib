import * as fs from "fs-extra";
import * as path from "path";
import {version} from "punycode";

export default class GameCheck {
	private version: string;

	constructor (version: string) {
		this.version = version;
	}

	checkVersionJson (): Promise<boolean> {
		return new Promise<boolean>(resolve => {
			fs.stat(path.join(__game.versions, `${version}.json`)).then((data: any) => {
				console.log(data);
			});
		})
	}

	checkVersionJar () {r

	}

	checkLibraries () {

	}

	checkAssesets () {

	}
}