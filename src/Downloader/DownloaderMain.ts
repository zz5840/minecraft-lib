import {EventEmitter} from 'events';
import * as download from "download";
import * as fs from "fs";
import * as path from "path";
import DownloaderTask from './DownloaderTask';

export default class DownloaderMain {
	public readonly event: EventEmitter;
	private thread: number;
	private list: Array<Downloader.DownloadListTask>;
	private downloading: Array<DownloaderTask>;
	private awaitDownloading: Array<Downloader.DownloadListTask>;

	public constructor (taskList: Array<Downloader.DownloadListTask> = [], thread = 8) {
		this.list = taskList;
		this.awaitDownloading = this.list.concat([]);
		this.thread = thread;
		this.event = new EventEmitter();
	}

	public setThread (thread: number) {
		this.thread = thread;
	}

	public addTask (task: Downloader.DownloadListTask | Array<Downloader.DownloadListTask>) {
		if (task instanceof Array) {
			this.list.concat(task);
		} else {
			this.list.push(task);
		}
	}

	public start (): void {
		console.log('started');
		this.downloading = new Array(this.thread).fill(null);
		this.downloading.forEach((value, index) => {
			this.downloadedHandle(index);
		});
	}

	public downloadedHandle (index: number) {
		let task = this.getNextTask();
		if (typeof task !== 'boolean') {
			this.downloading[index] = new DownloaderTask(index, task, this);
			this.progress(index);
		} else {
			this.downloading[index] = null;
		}
	}

	private getNextTask (): Downloader.DownloadListTask | boolean {
		if (this.awaitDownloading.length === 0) {
			return false;
		} else {
			return this.awaitDownloading.shift();
		}
	}

	private progress (thread: number) {
		this.event.emit('progress', thread, this.list.length - this.awaitDownloading.length, this.list.length);
		if (this.awaitDownloading.length === 0) {
			this.event.emit('done');
		}
	}
}