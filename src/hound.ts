import EventEmitter from 'events';
import fs, {
	FSWatcher,
} from 'fs';
import path from 'path';

export interface WatchOptions {
	watchFn ? : Function;
}

/**
 * Watch one or more files or directories for changes.
 *
 * Options:
 *   - watchFn: Specify a custom filesystem watch function (eg: `fs.watchFile`)
 *
 * @param {string|array} src The file or directory to watch.
 * @param {WatchOptions} options
 * @return {Hound}
 */
export function watch(src: string | string[], options ? : WatchOptions): Hound {
	var watcher = new Hound(options)
	if (src instanceof Array) {
		for (const dir of src) {
			watcher.watch(dir);
		}
	} else watcher.watch(src);
	return watcher
}

export declare interface Hound extends EventEmitter {
	on (event: 'watch', cb: (file: string) => void): this;
	on (event: 'unwatch', cb: (file: string) => void): this;
	on (event: 'create', cb: (file: string) => void): this;
	on (event: 'change', cb: (file: string) => void): this;
	on (event: 'delete', cb: (file: string) => void): this;
}

/**
 * The Hound class tracks watchers and changes and emits events.
 */
export class Hound extends EventEmitter {
	constructor(options?: WatchOptions) {
		super();
		this.options = options || {}
	}
	options: WatchOptions;
	watchers: {
		[src: string]: FSWatcher;
	} = {};

	/**
	 * Watch a file or directory tree for changes, and fire events when they happen.
	 * Fires the following events:
	 * 'create' (file, stats)
	 * 'change' (file, stats)
	 * 'delete' (file)
	 * @param {string} src
	 * @return {Hound}
	 */
	watch(src: string): Hound {
		const self: Hound = this;
		let stats = fs.statSync(src);
		let lastChange: number|null = null;
		const watchFn: Function = self.options.watchFn || fs.watch;
		if (stats.isDirectory()) {
			var files = fs.readdirSync(src)
			for (var i = 0, len = files.length; i < len; i++) {
				self.watch(src + path.sep + files[i])
			}
		}
		self.watchers[src] = watchFn(src, () => {
			if (fs.existsSync(src)) {
				stats = fs.statSync(src)
				if (stats.isFile()) {
					if (lastChange === null || stats.mtime.getTime() > lastChange)
						self.emit('change', src, stats)
					lastChange = stats.mtime.getTime()
				} else if (stats.isDirectory()) {
					// Check if the dir is new
					if (self.watchers[src] === undefined) {
						self.emit('create', src, stats)
					}
					// Check files to see if there are any new files
					var dirFiles = fs.readdirSync(src)
					for (var i = 0, len = dirFiles.length; i < len; i++) {
						var file = src + path.sep + dirFiles[i]
						if (self.watchers[file] === undefined) {
							self.watch(file)
							self.emit('create', file, fs.statSync(file))
						}
					}
				}
			} else {
				self.unwatch(src)
				self.emit('delete', src)
			}
		});
		self.emit('watch', src);
		return this;
	}

	/**
	 * Unwatch a file or directory tree.
	 * @param {string} src
	 */
	unwatch(src: string) {
		var self = this
		if (self.watchers[src] !== undefined) {
			self.watchers[src].close()
			delete self.watchers[src]
		}
		self.emit('unwatch', src)
	}

	/**
	 * Unwatch all currently watched files and directories in this watcher.
	 */
	clear() {
		var self = this
		for (var file in this.watchers) {
			self.unwatch(file)
		}
	}
}

export default Hound;
module.exports = Hound;

Object.assign(Hound, {
	default: Hound,
	Hound,
	watch,
});
