import {EventEmitter} from 'events';
import * as download from "download";
import * as fs from "fs";
import * as path from "path";
import DownloaderTask from './DownloaderTask';

export default class DownloaderMain {
	public readonly event: EventEmitter;
	private thread: number;
	private list: Array<Downloader.DownloadListTask>;
	private index: number;
	private downloading: Array<DownloaderTask>;
	private done: number;

	/**
	 * multi-thread downloader
	 * @param {Array<Downloader.DownloadListTask>} taskList
	 * @param {number} thread   max thread number
	 */
	public constructor (taskList: Array<Downloader.DownloadListTask> = [], thread = 8) {
		this.list = taskList;
		this.thread = thread;
		this.event = new EventEmitter();
		this.index = 0;
		this.done = 0;
		this.event.on('done', () => {
			this.done++;
		})
	}

	/**
	 * get the number of downloaded files
	 * @returns {number}
	 */
	public getDoneNum (): number {
		return this.done;
	}

	/**
	 * get specified task info by index
	 * @param {number} index
	 * @returns {Downloader.DownloadListTask}
	 */
	public getTask (index: number) {
		return this.list[index];
	}

	/**
	 * add a task or task list to the end of the list
	 * @param {Downloader.DownloadListTask | Array<Downloader.DownloadListTask>} task
	 */
	public addTask (task: Downloader.DownloadListTask | Array<Downloader.DownloadListTask>) {
		if (task instanceof Array) {
			this.list.concat(task);
		} else {
			this.list.push(task);
		}
	}

	/**
	 * start download (must be called manually)
	 */
	public start (): void {
		console.log('started');
		this.downloading = new Array(this.thread).fill(null);
		this.downloading.forEach((value, index) => {
			this.downloadedHandle(index);
		});
	}

	/**
	 * will be called when a file is downloaded
	 * @param {number} thread
	 */
	public downloadedHandle (thread: number) {
		let has = this.hasNextTask();
		if (has) {
			this.index++;
			this.downloading[thread] = new DownloaderTask(thread, this.index, this);
		} else {
			this.downloading[thread] = null;
		}
	}

	/**
	 * judge if the download list has next task, if false, emit end event
	 * @returns boolean
	 */
	private hasNextTask (): Downloader.DownloadListTask | boolean {
		if (this.list.length === this.index + 1) {
			// TODO  end event will be emitted many times
			console.log(this.list.filter(val => val === null).length);
			// if (this.list.filter(val => val === null).length === this.list.length - 1) {
			// 	this.event.emit('end');
			// }
			return false;
		} else {
			return true;
		}
	}
}