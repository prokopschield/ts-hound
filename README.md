ts-hound - directory tree watcher for node.js
=============================================

**Note**  
This package is a TS re-write of [node-hound](https://github.com/gforceg/node-hound), but is not affiliated with it.

Cross platform directory tree watcher that works, even on Windows
-----------------------------------------------------------------

The philosophy of hound is:

* **Be reliable, work on every platform**
* **Be fast**
* **Be simple**

hound is designed to be very reliable, fast, and simple.  There are no runtime
dependencies outside of the standard node.js libraries.

Installation
------------

Install using npm:

```
npm install ts-hound
```

Because hound has no runtime dependencies, it is also possible to download the
library manually and require it directly.

Usage
-----

```javascript
hound = require('ts-hound')

// Create a directory tree watcher.
watcher = hound.watch('/tmp')

// Create a file watcher.
watcher = hound.watch('/tmp/file.txt')

// Add callbacks for file and directory events.  The change event only applies
// to files.
watcher.on('create', function(file, stats) {
  console.log(file + ' was created')
})
watcher.on('change', function(file, stats) {
  console.log(file + ' was changed')
})
watcher.on('delete', function(file) {
  console.log(file + ' was deleted')
})

// Unwatch specific files or directories.
watcher.unwatch('/tmp/another_file')

// Unwatch all watched files and directories.
watcher.clear()
```
