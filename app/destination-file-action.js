import fs from 'fs';
import path from 'path';
import { DestinationAction } from './actions';
import Reporter from './reporter';

export default class DestinationFileAction extends DestinationAction {
  constructor(config) {
    super(config);
    this.folder = config.fs.folder;
    this.pretty = config.fs.pretty || false;
    console.log('DestinationFileAction.constructor: ', this.config);
  }

  init() {
    Reporter.sendEvent('DestinationFileAction', 'init', 'core.actions');
  }

  run(name, payload) {
    return new Promise((resolve, reject) => {
      const output = path.join(this.folder, name);
      fs.writeFile(output, JSON.stringify(payload, undefined, this.pretty ? 2 : 0), 'utf8', (err) => {
        if (err) {
          reject(err);
        }

        console.log(`DestinationFileAction.run: File written: ${output}.`);
        resolve(output);
      });
    });
  }

  finalize() {
    console.log('DestinationFileAction.finalize: ', this.config);
    Reporter.sendEvent('DestinationFileAction', 'finalize', 'core.actions');
    this.setStatus('SHUTDOWN');
  }
}
