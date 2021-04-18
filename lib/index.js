"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = exports.Hound = void 0;
const hound_1 = require("./hound");
Object.defineProperty(exports, "Hound", { enumerable: true, get: function () { return hound_1.Hound; } });
Object.defineProperty(exports, "watch", { enumerable: true, get: function () { return hound_1.watch; } });
exports.default = hound_1.Hound;
module.exports = hound_1.Hound;
Object.assign(hound_1.Hound, {
    default: hound_1.Hound,
    Hound: hound_1.Hound,
    watch: hound_1.watch,
});
