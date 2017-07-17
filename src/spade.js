import schedule from 'node-schedule';
import fs from 'fs';
import path from 'path';
import DestinationS3Action from './destination-s3-action';
import SourceFileWatchAction from './source-file-watch-action';
import SourceSqliteAction from './source-sqlite-action';
import Reporter from './reporter';


export class Spade {
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

  loadConfig(configFilename) {
    this.configLoadTime = Date.now();
    // the config file shold be loaded dynamically when init is called as it might
    // have changed by the UI; hence, not using import top of the file and
    // diabling linter error.
    try {
      // Read in the configuration json file. This may be from s3 or http endpoint
      this.config = JSON.parse(fs.readFileSync(configFilename));
    } catch (e) {
      console.error('Unable to load configuration object.', e);
      this.config = null;
    }
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

  testCleanup() {
    const directory = this.sources.testFiles.fileWatch.folder;

    fs.readdir(directory, (err, files) => {
      if (err) throw err;

      const numFiles = files.length;
      for (let i = 0; i < numFiles; i += 1) {
        const file = files[i];
        fs.unlink(path.join(directory, file), (error) => {
          if (error) throw error;
        });
      }
    });
  }

  test() {
    const testConfig = './test-config.json';
    this.init(testConfig);

    if (this.config == null || this.config.departmentId !== '12345') {
      console.error('Did not load configuration object properly');
      return 1;
    }

    const directory = this.sources.testFiles.fileWatch.folder;
    const moveFolder = this.sources.testFiles.fileWatch.processed.folder;
    const testFilename = 'testJson.json';
    fs.createReadStream(testFilename).pipe(fs.createWriteStream(directory + testFilename));

    const fileMoved = fs.existsSync(directory + testFilename);
    const newLocation = fs.existsSync(path.resolve(directory + moveFolder + testFilename));

    if (fileMoved !== false && newLocation !== true) {
      console.error('file watcher did not move file correctly');
      this.testCleanup();
      return 1;
    }

    // TODO: Figure out how to properly test destination endpoint.

    console.log('Test ran successfully. Action creation and file watch move tested.');
    return 0;
  }

  // load config, create all actions
  init(config) {
    if (typeof config === 'string') {
      this.config = this.loadConfig(config);
    } else {
      this.config = config;
    }

    this.startReporterHeartbeat();
    Reporter.sendEvent('spade.init', 'begin');

    this.sources = {};
    this.destinations = {};

    const destinationKeys = Object.keys(this.config.destinations);
    for (let i = 0; i < destinationKeys.length; i += 1) {
      const key = destinationKeys[i];
      const conf = this.config.destinations[key];
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

    const sourceKeys = Object.keys(this.config.sources);
    for (let i = 0; i < sourceKeys.length; i += 1) {
      const key = sourceKeys[i];
      const conf = this.config.sources[key];
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
    // Wrap creation of Actions in try block and default to null upon exception.
    try {
      if (conf.s3) {
        action = new DestinationS3Action(conf);
      }
    } catch (e) {
      action = null;
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
