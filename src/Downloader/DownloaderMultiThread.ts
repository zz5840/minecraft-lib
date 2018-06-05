import {EventEmitter} from 'events';
import DownloaderMultiThreadTask from './DownloaderMultiThreadTask';

export default class DownloaderMultiThread {
	public readonly event: EventEmitter;
	private thread: number;
	private list: Array<Downloader.DownloadListTask>;
	private index: number;
	private downloading: Array<DownloaderMultiThreadTask>;
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
	 * @returns {number}
	 */
	public getDoneNum (): number {
		return this.done;
	}

	/**
	 * @returns {number}
	 */
	public getTotalNum (): number {
		return this.list.length;
	}

	/**
	 * @returns {number}
	 */
	public getRestNum (): number {
		return this.getTotalNum() - this.getDoneNum();
	}

	/**
	 * @returns {number}
	 */
	public getProgressPercent (): number {
		return (this.getDoneNum() / this.getTotalNum());
	}

	/**
	 * get specified task object by index
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
			this.list.push(...task);
		} else {
			this.list.push(task);
		}
	}

	/**
	 * start download (must be called manually)
	 */
	public start (): void {
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
			this.downloading[thread] = new DownloaderMultiThreadTask(thread, this.index, this);
			this.index++;
		} else {
			this.downloading[thread] = null;
		}
	}

	/**
	 * judge if the download list has next task, if false, emit end event
	 * @returns boolean
	 */
	private hasNextTask (): boolean {
		if (this.list.length === this.index) {
			if (this.downloading.filter(val => val === null).length === this.thread - 1) {
				this.event.emit('end');
			}
			return false;
		} else {
			return true;
		}
	}
}