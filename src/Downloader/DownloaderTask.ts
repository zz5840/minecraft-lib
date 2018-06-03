import * as download from "download";
import * as fs from "fs-extra";
import * as path from "path";
import DownloaderMain from "./DownloaderMain";

export default class DownloaderTask {
	private readonly index: number;
	private readonly d: DownloaderMain;
	private task: Downloader.DownloadListTask;

	public constructor (index: number, task: Downloader.DownloadListTask, d: DownloaderMain) {
		this.index = index;
		this.task = task;
		this.d = d;
		this.download();
	}

	private download () {
		fs.ensureDir(this.task.dest).then(() => {
			return new Promise((resolve, reject) => {
				download(this.task.url).pipe(fs.createWriteStream(path.join(this.task.dest, this.task.name)))
					.on('close', () => {
						resolve();
					});
			});
		}).then(() => {
			this.d.downloadedHandle(this.index);
		}).catch(err => {
			console.log(err);
		})
	}
}