import path from 'path';
import fs from 'fs';
import mvElseCp from 'mv';
import watch from 'gulp-watch';

import { SourceAction } from './actions';


export default class SourceFileWatchAction extends SourceAction {
  constructor(conf, destination) {
    super(conf, destination);
    this.stream = null;
    console.log('FileWatch.constructor: ', this.conf);
  }

  // Note: define init to not start schedule
  init() {
    // Note: no need to call super.init() as this.startSchedule(); since we dont
    // have to poll the source and instead watch triggers based on file events
    this.stream = this.watch(this.conf.fileWatch.folder);
  }

  finalize() {
    if (this.stream) {
      this.stream.close();
      this.stream = null;
    }
    console.log('FileWatch.finalize: ', this.conf);
  }

  // run() funtion not defined as the file-watch will not use it

  watch(directoryToWatch) {
    console.log('Performing watch on ', directoryToWatch);
    const pattern = `${directoryToWatch}\\*`;
    const destDir = path.normalize(`${directoryToWatch}${path.sep}processed`);

    return watch(
      pattern,
      {
        events: ['add'],
        awaitWriteFinish: true,
        ignoreInitial: false,
        read: false,
      },
      (event) => {
        const basename = path.basename(event.path);
        const sourceFile = event.path;
        const destFile = `${destDir}${path.sep}${basename}`;
        console.log('Event: ', event, 'mv source: ', sourceFile,
        'mv dest: ', destFile);

        // send sourceFile to s3. If it failes to upload, do not proceed
        this.destination.run(sourceFile).then(() => {
          // it first created all the necessary directories, and then
          // tried fs.rename, then falls back to using ncp to copy the dir
          // to dest and then rimraf to remove the source dir
          mvElseCp(
            sourceFile,
            destFile,
            { mkdirp: true },  // TODO: when folder didn't exist, it created it
                               // but it deleted the files instead of mv!
            (mvErr) => {
              if (!mvErr) {
                // if mvElseCp succeeds, make sure source file is gone
                // TODO: double check mvElseCp implementation
                if (fs.existsSync(event.path)) {
                  fs.unlink(event.path, (rmErr) => {
                    console.log(`====[ Remove failed for ${event.path}`, rmErr);
                  });
                }
              } else {
                console.log('----[ mvElsecp failed. ', mvErr);
              }
            },
          );
        });
      },
    );
  }
}
