import * as fs from "fs-extra";
import * as progress from 'request-progress';
import * as request from 'request';
import * as path from "path";
import DownloaderMultiThread from "./DownloaderMultiThread";

export default class DownloaderMultiThreadTask {
	private readonly thread: number;
	private readonly d: DownloaderMultiThread;
	private readonly index: number;
	private task: Downloader.DownloadListTask;

	/**
	 * a download task, only for downloading one file
	 * @param {number} thread
	 * @param {number} index
	 * @param {DownloaderMultiThread} d
	 */
	public constructor (thread: number, index: number, d: DownloaderMultiThread) {
		this.thread = thread;
		this.index = index;
		this.d = d;
		this.task = this.d.getTask(index);
		this.download();
	}

	/**
	 * start download
	 */
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
					resolve();
				}).pipe(fs.createWriteStream(path.join(this.task.dest, this.task.name)));
			});
		}).then(() => {
			this.d.downloadedHandle(this.thread);
			this.d.event.emit('done', this.thread, this.index);
		}).catch((err: any) => {
			console.log(err);// TODO add error event
			this.d.addTask(this.task);
		})
	}
}