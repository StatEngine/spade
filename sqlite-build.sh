#!/bin/bash
# note the target=1.6.10 is the electron version and that electron-v1.6-darwin-x64 neest version and arch as well.
cd node_modules/sqlite3 && ../node-gyp/bin/node-gyp.js configure --module_name=node_sqlite3 --module_path=../lib/binding/electron-v1.6-darwin-x64 && ../node-gyp/bin/node-gyp.js rebuild --target=1.6.10 --arch=x64 --target_platform=darwin --dist-url=https://atom.io/download/atom-shell --module_name=node_sqlite3 --module_path=../lib/binding/electron-v1.6-darwin-x64
