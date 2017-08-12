#!/bin/bash
# rebuild npm modules for use by electron as oposed to nodejs.
# note that all modules that have native dependancies need to be in the app
# folder and not in the root. this is for the spacial case where the tests
# need to use something like sqlite3. In such case, add them as dev dependancies
# not prod note that this doesn't do --types prod,dev,optional skips prod.
./node_modules/.bin/electron-rebuild --force --types dev,optional
