import path from 'path';
import fs from 'fs';
import mvElseCp from 'mv';
import watch from 'gulp-watch';

import { SourceAction } from './actions';


export default class SourceFileWatchAction extends SourceAction {
  constructor(conf, destination) {
    super(conf, destination);
    this.type = 'FileWatch';
    this.watch(conf.fileWatch.folder);
    console.log('FileWatch.constructor: ', this.conf);
  }

  watch(directoryToWatch) {
    console.log('Performing watch on ', directoryToWatch);
    const pattern = `${directoryToWatch}\\*`;
    const destDir = path.normalize(`${directoryToWatch}${path.sep}processed`);

    watch(
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

  runTest() {
    console.log('FileWatch.run: ', this.conf);
    const data = [
      'fila1.xml',
      'fila2.xml',
      'fila3.xml',
    ];
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];
      if (!this.destination.run(item)) {
        return false;
      }
    }

    return true;
  }

  finalize() {
    console.log('FileWatch.finalize: ', this.conf);
  }
}
