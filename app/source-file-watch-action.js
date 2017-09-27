import path from 'path';
import fs from 'fs';
import mvElseCp from 'mv';
import watch from 'gulp-watch';
import Reporter from './reporter';
import { SourceAction } from './actions';

export const type = 'fileWatch';
export default class SourceFileWatchAction extends SourceAction {
  constructor(config, destination) {
    super(config, destination);
    this.stream = null;
    console.log('FileWatch.constructor: ', this.config);
  }

  static getDefaultConfig(currentConfig) {
    return {
      destination: null,
      fileWatch: {
        folder: '',
        processed: {
          folder: '',
        },
      },
    };
  }

  static validateConfigProperties(config) {
    if (config.destination === null || config.destination === '') {
      return false;
    } else if (config.fileWatch.folder === null || config.fileWatch.folder === '') {
      return false;
    } else if (config.fileWatch.processed.folder === null || config.fileWatch.processed.folder === '') {
      return false;
    }
    return true;
  }

  // Note: define init to not start schedule
  init() {
    // Note: no need to call super.init() as this.startSchedule(); since we dont
    // have to poll the source and instead watch triggers based on file events
    this.stream = this.watch(this.config.fileWatch.folder);
    Reporter.sendEvent('SourceFileWatchAction', 'init', 'core.actions');
  }

  finalize() {
    if (this.stream) {
      this.stream.close();
      this.stream = null;
    }
    Reporter.sendEvent('SourceFileWatchAction', 'finalize', 'core.actions');
    console.log('FileWatch.finalize: ', this.config);
  }

  // run() funtion not defined as the file-watch will not use it

  watch(directoryToWatch) {
    // Default watch options may change depending on if watching a network drive.
    const watchOptions = {
      events: ['add'],
      awaitWriteFinish: true,
      ignoreInitial: false,
      read: false,
    };
    const resolvedDirectory = path.resolve(directoryToWatch);
    // Check if path is to a network drive
    console.log('Performing watch on ', resolvedDirectory);
    const pattern = `${resolvedDirectory}\\*`;
    let moveFolder = this.config.fileWatch.processed.folder;
    // Join does both a concat and normalize
    if (path.isAbsolute(moveFolder)) {
      moveFolder = path.resolve(moveFolder);
    } else {
      moveFolder = path.join(resolvedDirectory, path.sep, moveFolder);
    }
    console.log('Moving files to: ', moveFolder);
    return watch(
      pattern,
      watchOptions,
      (event) => {
        const basename = path.basename(event.path);
        const sourceFile = event.path;
        const destFile = path.join(moveFolder, path.sep, basename);
        console.log('Event: ', event, 'mv source: ', sourceFile,
        'mv dest: ', destFile);
        Reporter.sendEvent('SourceFileWatchAction', 'watchEvent', 'core.actions');

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
                    const removeException = `====[ Remove failed for ${event.path}`;
                    console.log(removeException, rmErr);
                    Reporter.sendException(removeException);
                  });
                }
              } else {
                const moveException = `----[ mvElsecp failed. ${mvErr}`;
                console.log(moveException);
                Reporter.sendException(moveException);
              }
            },
          );
        })
        .catch((err) => {
          const runException = `=====[ Destination run failed: ${err}`;
          console.log(runException);
          Reporter.sendException(runException);
        });
      },
    );
  }
}
