const fs = require('fs-extra');
const progress = require('request-progress');
const request = require('request');
const path = require('path');

const PProgress = require('p-progress');
const { EventEmitter } = require('events');

class MultiThreadDownloader {
	/**
	 * multi-thread downloader
	 * @param {Array} taskList
	 * @param {number} thread   max thread number
	 */
	constructor (taskList = [], thread = 32) {
		this.list = taskList;
		this.thread = Math.min(taskList.length, thread);
		this.event = new EventEmitter();
		this.index = 0;
		this.done = 0;
		this.event.on('done', () => {
			this.done++;
		});
	}

	/**
	 * @returns {number}
	 */
	getDoneNum () {
		return this.done;
	}

	/**
	 * @returns {number}
	 */
	getTotalNum () {
		return this.list.length;
	}

	/**
	 * @returns {number}
	 */
	getRestNum () {
		return this.getTotalNum() - this.getDoneNum();
	}

	/**
	 * @returns {number}
	 */
	getProgressPercent () {
		return (this.getDoneNum() / this.getTotalNum());
	}

	/**
	 * get specified task object by index
	 * @param {number} index
	 */
	getTask (index) {
		return this.list[index];
	}

	/**
	 * add a task or task list to the end of the list
	 * @param task
	 */
	addTask (task) {
		if (task instanceof Array) this.list.push(...task);
		else this.list.push(task);
	}

	/**
	 * start download (must be called manually)
	 */
	start () {
		this.downloading = new Array(this.thread).fill(null);
		this.downloading.forEach((value, index) => {
			this.downloadedHandle(index);
		});
	}

	/**
	 * will be called when a file is downloaded
	 * @param {number} thread
	 */
	downloadedHandle (thread) {
		let has = this.hasNextTask();
		if (has) {
			this.downloading[thread] = new DownloaderMultiThreadTask(thread, this.index, this);
			this.index++;
		} else this.downloading[thread] = 'finished';
	}

	/**
	 * judge if the download list has next task, if false, emit end event
	 * @return boolean
	 */
	hasNextTask () {
		if (this.list.length === this.index) {
			if (this.downloading.filter(val => val === 'finished').length === this.thread - 1)
				this.event.emit('end');
			return false;
		} else return true;
	}
}

class DownloaderMultiThreadTask {
	/**
	 * a download task, only for downloading one file
	 * @param {number} thread
	 * @param {number} index
	 * @param {MultiThreadDownloader} d
	 */
	constructor (thread, index, d) {
		this.thread = thread;
		this.index = index;
		this.d = d;
		this.task = this.d.getTask(index);
		this.download();
	}

	/**
	 * start download
	 */
	download () {
		fs.ensureDir(this.task.dest).then(() => {
			let dest = this.task.dest;
			let name = this.task.name;
			if (typeof name === 'undefined') name = path.parse(url).base;
			return new Promise((resolve, reject) => {
				progress(request(this.task.url), {
					throttle: 500
				}).on('progress', (state) => {
					this.d.event.emit('progress', this.thread, this.index, state);
				}).on('error', (err) => {
					reject(err);
				}).on('end', () => {
					resolve();
				}).pipe(fs.createWriteStream(path.join(dest, name)));
			});
		}).then(() => {
			this.d.downloadedHandle(this.thread);
			this.d.event.emit('done', this.thread, this.index);
		}).catch(err => {
			this.d.event.emit('error', this.thread, this.index, err);
			this.d.addTask(this.task);
		})
	}
}

module.exports = MultiThreadDownloader;