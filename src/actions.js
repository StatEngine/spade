

class SourceAction {
  constructor(conf, destination) {
    this.conf = conf;
    this.destination = destination;
    this.type = null;
    console.log('SourceAction.constructor: ', this.conf);
  }

  run() {
    console.log('SourceAction.run: ', this.conf);
    return true;
  }

  finalize() {
    console.log('SourceAction.finalize: ', this.conf);
  }
}

class FileWatch extends SourceAction {
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

class DestinationAction {
  constructor(conf) {
    this.conf = conf;
    this.type = null;
    console.log('DestinationAction.constructor: ', this.conf);
  }

  run(data) {
    console.log('DestinationAction.run: ', this.conf, data);
    return true;
  }

  finalize() {
    console.log('DestinationAction.finalize: ', this.conf);
  }
}

class S3Destination extends DestinationAction {
  constructor(conf) {
    super(conf);
    this.type = 'S3Destination';
    console.log('S3Destination.constructor: ', this.conf);
  }

  run(filename) {
    console.log('S3Destination.run sending file to S3: ', filename, this.conf);
    return true;
  }

  finalize() {
    console.log('S3Destination.finalize: ', this.conf);
  }
}

function init() {
  // the config file shold be loaded dynamically when init is called as it might
  // have changed by the UI; hence, not using import top of the file and
  // diabling linter error.
  const config = require('./actions.json');  // eslint-disable-line global-require
  console.log('loaded config: ', config);
  const destination = new S3Destination(config.destinations.incidents);
  const source = new FileWatch(config.sources.cadFiles, destination);
  source.run();
}

export default { init };
