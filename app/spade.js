import schedule from 'node-schedule';
import fs from 'fs';
import path from 'path';
import DestinationS3Action from './destination-s3-action';
import DestinationStdOutAction from './destination-stdout-action';
import DestinationFileAction from './destination-file-action';
import SourceFileWatchAction from './source-file-watch-action';
import SourceSqliteAction from './source-sqlite-action';
import Reporter from './reporter';
import gitState from './git-state.json';
import appPackage from './package.json';

export class Spade {
  constructor() {
    this.spadeCreateTime = Date.now();
    this.sources = null;
    this.destinations = null;
    this.heartbeat = null;

    // TODO: load from settings
    this.userConsent = true;
    this.departmentId = 12345;
    this.gitState = gitState;
    this.version = `${appPackage.version}`;
  }

  loadConfig(configFilename) {
    this.configLoadTime = Date.now();
    // the config file shold be loaded dynamically when init is called as it might
    // have changed by the UI; hence, not using import top of the file and
    // diabling linter error.
    try {
      // Read in the configuration json file. This may be from s3 or http endpoint
      console.log('----[ spade.loadConfig, configFilename: ', configFilename);
      this.config = JSON.parse(fs.readFileSync(configFilename));
      this.departmentId = this.config.departmentId;
    } catch (e) {
      console.error('Unable to load configuration object.', e);
      this.config = null;
    }
    return this.config;
  }

  getHasUserConsent() {
    return this.userConsent;
  }

  getDepartmentId() {
    return this.departmentId;
  }

  getVersion() {
    return this.version;
  }

  getCommitID() {
    return this.gitState.commit;
  }

  // load config, create all actions
  init(config) {
    console.log('Package version: ', process.env.npm_package_version);

    if (typeof config === 'string') {
      this.config = this.loadConfig(config);
    } else if (typeof config === 'object') {
      this.config = config;
    } else {
      const defaultConfigPath = path.join(__dirname, 'actions.json');
      console.log('----[ Using default config: ', defaultConfigPath);
      this.config = this.loadConfig(defaultConfigPath);
    }

    this.startReporterHeartbeat();
    console.log('Spade Version: ', this.getVersion());

    this.sources = {};
    this.destinations = {};

    const destinationKeys = Object.keys(this.config.destinations);
    for (let i = 0; i < destinationKeys.length; i += 1) {
      const key = destinationKeys[i];
      const conf = this.config.destinations[key];
      const action = Spade.createDestinationAction(conf);
      if (action) {
        this.destinations[key] = action;
      } else {
        console.log('====[ Skipping, failed to process destination action: ', key);
      }
    }

    // call init on the destinations. Consider calling from source.init if
    // init was not run already
    const createdDestinationKeys = Object.keys(this.destinations);
    for (let i = 0; i < createdDestinationKeys.length; i += 1) {
      const key = createdDestinationKeys[i];
      let destination = this.destinations[key];
      try {
        destination.init();
      } catch (e) {
        console.log('====[ Unable to init destination Action: ', destination.config, e.stack);
        destination = null;
        Reporter.sendException('Unable to init destination action');
      }
    }

    const sourceKeys = Object.keys(this.config.sources);
    for (let i = 0; i < sourceKeys.length; i += 1) {
      const key = sourceKeys[i];
      const conf = this.config.sources[key];
      const action = this.createSourceAction(conf);
      if (action) {
        this.sources[key] = action;
      } else {
        console.log('====[ Skipping, failed to process source action: ', key);
      }
    }

    const createdSourcesKeys = Object.keys(this.sources);
    for (let i = 0; i < createdSourcesKeys.length; i += 1) {
      const key = createdSourcesKeys[i];
      let source = this.sources[key];
      try {
        source.init();
      } catch (e) {
        console.log('====[ Unable to init source Action: ', source.config, e.stack);
        source = null;
        Reporter.sendException('Unable to init source action');
      }
    }
    Reporter.sendEvent('spade', 'init', 'core.service');
  }

  // stop all tasks
  finalize() {
    const createdSourcesKeys = Object.keys(this.sources);
    for (let i = 0; i < createdSourcesKeys.length; i += 1) {
      const key = createdSourcesKeys[i];
      const source = this.sources[key];
      // explicitly stop the schedule incase subclass doesn't
      try {
        source.stopSchedule();
        source.finalize();
      } catch (e) {
        const finalizeException = `====[ Unable to finalize source Action: ${source.config}`;
        console.log(finalizeException, e.stack);
        Reporter.sendException(finalizeException);
      }
    }

    const createdDestinationKeys = Object.keys(this.destinations);
    for (let i = 0; i < createdDestinationKeys.length; i += 1) {
      const key = createdDestinationKeys[i];
      const destination = this.destinations[key];
      try {
        destination.finalize();
      } catch (e) {
        console.log('====[ Unable to finalize destination Action: ', destination.config, e.stack);
      }
    }

    this.stopReporterHeartbeat();
    Reporter.sendTiming('core.service', 'sessionDuration', Date.now() - this.spadeCreateTime);
    Reporter.sendEvent('spade', 'finalize', 'core.service');
  }

  static createDestinationAction(conf) {
    let action = null;
    // Wrap creation of Actions in try block and default to null upon exception.
    try {
      if (conf.s3) {
        action = new DestinationS3Action(conf);
      } else if (conf.stdout) {
        action = new DestinationStdOutAction(conf);
      } else if (conf.file) {
        action = new DestinationFileAction(conf);
      }

      Reporter.sendEvent('spade', 'createDestinationAction', 'core.service');
    } catch (e) {
      const destinationCreateErr = `Unable to create destination action: ${e}`;
      action = null;
      Reporter.sendException(destinationCreateErr);
    }
    return action;
  }

  createSourceAction(conf) {
    let sourceAction = null;
    const destinationAction = this.destinations[conf.destination];
    if (destinationAction) {
      // Wrap creation of Actions in try block and default to null upon exception
      try {
        if (conf.fileWatch) {
          sourceAction = new SourceFileWatchAction(conf, destinationAction);
        } else if (conf.sqlite) {
          sourceAction = new SourceSqliteAction(conf, destinationAction);
        } else {
          console.log('====[ Source action Type not supported: ', conf);
        }
        Reporter.sendEvent('spade', 'createDestinationAction', 'core.service');
      } catch (e) {
        sourceAction = null;
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
        Reporter.sendEvent('spade', 'heartbeat', 'core.service');
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

// export singleton instance
const spade = new Spade();
export default spade;
