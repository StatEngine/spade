import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import { DestinationAction } from './actions';
import Reporter from './reporter';

export const type = 'stdout';
export default class DestinationStdOutAction extends DestinationAction {
  constructor(config) {
    super(config);
    this.client = null;
    console.log('DestinationStdOutAction.constructor: ', this.config);
  }

  init() {
    Reporter.sendEvent('DestinationStdOutAction', 'init', 'core.actions');
  }

  run(name, payload) {
    return new Promise((resolve, reject) => {
      console.log(`DestinationStdOutAction.run: name: ${name}, payload: ${JSON.stringify(payload)}`)
      resolve();
    });
  }

  finalize() {
    console.log('DestinationStdOutAction.finalize: ', this.config);
    Reporter.sendEvent('DestinationStdOutAction', 'finalize', 'core.actions');
    this.setStatus('SHUTDOWN');
  }
}
