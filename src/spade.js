import schedule from 'node-schedule';

import DestinationS3Action from './destination-s3-action';
import SourceFileWatchAction from './source-file-watch-action';
import SourceSqliteAction from './source-sqlite-action';
import Reporter from './reporter';


class Spade {
  constructor() {
    this.spadeCreateTime = Date.now();
    this.sources = null;
    this.destinations = null;
    this.heartbeat = null;

    // TODO: load from settings
    this.userConcent = true;
    this.departmentId = 12345;
    this.version = 'v1'; // TODO: include npm version + commit hash
  }

  loadConfig() {
    this.configLoadTime = Date.now();
    // the config file shold be loaded dynamically when init is called as it might
    // have changed by the UI; hence, not using import top of the file and
    // diabling linter error.
    this.config = require('./actions.json');  // eslint-disable-line global-require
    return this.config;
  }

  getHasUserConsent() {
    return this.userConcent;
  }

  getDepartmentId() {
    return this.departmentId;
  }

  getVersion() {
    return `${this.version}:commit hash`;
  }

  // load config, create all actions
  init() {
    const config = this.loadConfig();

    this.startReporterHeartbeat();
    Reporter.sendEvent('spade.init', 'begin');

    this.sources = {};
    this.destinations = {};

    const destinationKeys = Object.keys(config.destinations);
    for (let i = 0; i < destinationKeys.length; i += 1) {
      const key = destinationKeys[i];
      const conf = config.destinations[key];
      const action = Spade.createDestinationAction(conf);
      if (action) {
        this.destinations[key] = action;
        action.init();
      } else {
        console.log('====[ Skipping, faile to process destination action: ', key);
      }
    }

    // call init on the destinations. Consider calling from source.init if
    // init was not run already
    const createdDestinationKeys = Object.keys(this.destinations);
    for (let i = 0; i < createdDestinationKeys.length; i += 1) {
      const key = createdDestinationKeys[i];
      const destination = this.destinations[key];
      destination.init();
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

    const createdSourcesKeys = Object.keys(this.sources);
    for (let i = 0; i < createdSourcesKeys.length; i += 1) {
      const key = createdSourcesKeys[i];
      const source = this.sources[key];
      source.init();
    }
  }

  // stop all tasks
  finalize() {
    Reporter.sendEvent('spade.finalize', 'begin');
    const createdSourcesKeys = Object.keys(this.sources);
    for (let i = 0; i < createdSourcesKeys.length; i += 1) {
      const key = createdSourcesKeys[i];
      const source = this.sources[key];
      // explicitly stop the schedule incase subclass doesn't
      source.stopSchedule();
      source.finalize();
    }

    const createdDestinationKeys = Object.keys(this.destinations);
    for (let i = 0; i < createdDestinationKeys.length; i += 1) {
      const key = createdDestinationKeys[i];
      const destination = this.destinations[key];
      destination.finalize();
    }

    Reporter.sendTiming('spade.window', 'sessionDuration', Date.now() - this.sessionStart);
    this.stopReporterHeartbeat();
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
      } else if (conf.sqlite) {
        sourceAction = new SourceSqliteAction(conf, destinationAction);
      } else {
        console.log('====[ Source action Type not supported: ', conf);
      }
    } else {
      console.log('====[ Destination action not resolved for source: ',
        conf.destination, conf);
    }
    return sourceAction;
  }

  startReporterHeartbeat() {
    if (this.config.reporter && this.config.reporter.trigger &&
    this.config.reporter.trigger.schedule) {
      this.heartbeat = schedule.scheduleJob(this.config.reporter.trigger.schedule, () => {
        Reporter.sendEvent('core.telemetry', 'ping');
      });
    }
  }

  stopReportedHeartbeat() {
    if (this.heartbeat) {
      this.heartbeat.cancel();
      this.heartbeat = null;
    }
  }
}

// export singlton instance
const spade = new Spade();
export default spade;
