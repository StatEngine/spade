import DestinationS3Action from './destination-s3-action';
import SourceFileWatchAction from './source-file-watch-action';

export default class Main {
  constructor() {
    this.sources = null;
    this.destinations = null;
  }

  init() {
    // the config file shold be loaded dynamically when init is called as it might
    // have changed by the UI; hence, not using import top of the file and
    // diabling linter error.
    const config = require('./actions.json');  // eslint-disable-line global-require
    this.sources = {};
    this.destinations = {};

    const destinationKeys = Object.keys(config.destinations);
    for (let i = 0; i < destinationKeys.length; i += 1) {
      const key = destinationKeys[i];
      const conf = config.destinations[key];
      const action = Main.createDestinationAction(conf);
      if (action) {
        this.destinations[key] = action;
        action.init();
      } else {
        console.log('====[ Skipping, faile to process destination action: ', key);
      }
    }

    // call init on the destinations. Consider calling from source.init if
    // init was not run already
    for (let i = 0; i < this.destinations.length; i += 1) {
      this.destinations[i].init();
    }

    const sourceKeys = Object.keys(config.sources);
    for (let i = 0; i < sourceKeys.length; i += 1) {
      const key = sourceKeys[i];
      const conf = config.sources[key];
      const action = this.createSourceAction(conf);
      if (action) {
        this.sources[key] = action;
      } else {
        console.log('====[ Skipping, faile to process source action: ', key);
      }
    }

    const createdKeys = Object.keys(this.sources);
    for (let i = 0; i < createdKeys.length; i += 1) {
      const key = createdKeys[i];
      this.sources[key].init();
    }
  }

  static createDestinationAction(conf) {
    let action = null;
    if (conf.s3) {
      action = new DestinationS3Action(conf);
    }
    return action;
  }

  createSourceAction(conf) {
    let sourceAction = null;
    const destinationAction = this.destinations[conf.destination];
    if (destinationAction) {
      if (conf.fileWatch) {
        sourceAction = new SourceFileWatchAction(conf, destinationAction);
      } else {
        console.log('====[ Source action Type not supported: ', conf);
      }
    } else {
      console.log('====[ Destination action not resolved for source: ',
        conf.destination, conf);
    }
    return sourceAction;
  }
}
