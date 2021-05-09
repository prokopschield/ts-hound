"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hound = exports.watch = void 0;
const events_1 = __importDefault(require("events"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function watch(src, options) {
    var watcher = new Hound(options);
    if (src instanceof Array) {
        for (const dir of src) {
            watcher.watch(dir);
        }
    }
    else
        watcher.watch(src);
    return watcher;
}
exports.watch = watch;
class Hound extends events_1.default {
    constructor(options) {
        super();
        this.watchers = {};
        this.options = options || {};
    }
    watch(src) {
        try {
            const self = this;
            let stats = fs_1.default.statSync(src);
            let lastChange = null;
            const watchFn = self.options.watchFn || fs_1.default.watch;
            if (stats.isDirectory()) {
                var files = fs_1.default.readdirSync(src);
                for (var i = 0, len = files.length; i < len; i++) {
                    self.watch(src + path_1.default.sep + files[i]);
                }
            }
            self.watchers[src] = watchFn(src, () => {
                if (fs_1.default.existsSync(src)) {
                    stats = fs_1.default.statSync(src);
                    if (stats.isFile()) {
                        if (lastChange === null || stats.mtime.getTime() > lastChange)
                            self.emit('change', src, stats);
                        lastChange = stats.mtime.getTime();
                    }
                    else if (stats.isDirectory()) {
                        if (self.watchers[src] === undefined) {
                            self.emit('create', src, stats);
                        }
                        var dirFiles = fs_1.default.readdirSync(src);
                        for (var i = 0, len = dirFiles.length; i < len; i++) {
                            var file = src + path_1.default.sep + dirFiles[i];
                            if (self.watchers[file] === undefined) {
                                self.watch(file);
                                self.emit('create', file, fs_1.default.statSync(file));
                            }
                        }
                    }
                }
                else {
                    self.unwatch(src);
                    self.emit('delete', src);
                }
            });
            self.emit('watch', src);
        }
        catch (error) {
            this.emit(src, error);
        }
        return this;
    }
    unwatch(src) {
        var self = this;
        if (self.watchers[src] !== undefined) {
            self.watchers[src].close();
            delete self.watchers[src];
        }
        self.emit('unwatch', src);
    }
    clear() {
        var self = this;
        for (var file in this.watchers) {
            self.unwatch(file);
        }
    }
}
exports.Hound = Hound;
exports.default = Hound;
module.exports = Hound;
Object.assign(Hound, {
    default: Hound,
    Hound,
    watch,
});
