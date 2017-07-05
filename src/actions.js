export class DestinationAction {
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

export class SourceAction {
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

// export { SourceAction, DestinationAction };
