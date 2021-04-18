/// <reference types="node" />
import EventEmitter from 'events';
import { FSWatcher } from 'fs';
export interface WatchOptions {
    watchFn?: Function;
}
export declare function watch(src: string | string[], options?: WatchOptions): Hound;
export declare class Hound extends EventEmitter {
    constructor(options?: WatchOptions);
    options: WatchOptions;
    watchers: {
        [src: string]: FSWatcher;
    };
    watch(src: string): Hound;
    unwatch(src: string): void;
    clear(): void;
}
export default Hound;
