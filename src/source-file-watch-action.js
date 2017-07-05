import { SourceAction } from './actions';

export default class SourceFileWatchAction extends SourceAction {
  constructor(conf, destination) {
    super(conf, destination);
    this.type = 'FileWatch';
    console.log('FileWatch.constructor: ', this.conf);
  }

  run() {
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
