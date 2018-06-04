import * as fs from "fs-extra";
import * as progress from 'request-progress';
import * as request from 'request';
import * as path from "path";
import DownloaderMain from "./DownloaderMain";

export default class DownloaderTask {
	private readonly thread: number;
	private readonly d: DownloaderMain;
	private readonly index: number;
	private task: Downloader.DownloadListTask;

	public constructor (thread: number, index: number, d: DownloaderMain) {
		this.thread = thread;
		this.index = index;
		this.d = d;
		this.task = this.d.getTask(index);
		this.download();
	}

	private download () {
		fs.ensureDir(this.task.dest).then(() => {
			return new Promise((resolve, reject) => {
				progress(request(this.task.url), {
					throttle: 500
				}).on('progress', (state: Downloader.DownloadProgress) => {
					this.d.event.emit('progress', this.thread, this.index, state);
				}).on('error', (err: any) => {
					reject(err);
				}).on('end', () => {
					this.d.event.emit('done', this.thread, this.index);
					resolve();
				}).pipe(fs.createWriteStream(path.join(this.task.dest, this.task.name)));
			});
		}).then(() => {
			this.d.downloadedHandle(this.thread);
		}).catch((err: any) => {
			console.log(err);// TODO add error event
			this.d.addTask(this.task);
		})
	}
}