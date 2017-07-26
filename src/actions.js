import schedule from 'node-schedule';

export class DestinationAction {
  constructor(config) {
    this.config = config;
    this.status = 'CREATED';
    this.error = null;
    console.log('DestinationAction.constructor: ', this.config);
  }

  setStatus(status) {
    this.status = status;
  }

  printStatus() {
    if (this.status !== 'ERROR') {
      console.log(this.status);
    } else {
      this.printError();
    }
  }

  printError() {
    // TODO: I think we should pass Error class objects and print them through
    // the class rather than at location of error. We can properly capture lineNos
    // and other information as well as have custom print for different error types
    console.log('ERROR: ', this.error);
  }

  setError(error) {
    this.error = error;
    this.setStatus('ERROR');
    // TODO: Could possibly send some notification to ui element
    // or use the reporter to send the error to google-analytics
  }

  clearError() {
    this.error = null;
    if (this.status === 'ERROR') {
      this.status = 'READY';
    }
  }

  /**
   * Any operation that can throw an exception none trivial setup should occur
   * here instead of the constructor.
   */
  init() {
  }

  /**
   * @data maybe either an absolute path of a file or json (in memory) object.
   *
   * If a destination action failes to send, the expected behavior should
   * be that the next time the source triggers, it have more to send. If it is
   * a db pull source, the next pull should from from last successfull send
   * until "now"
   */
  run(name, payload) {
    console.log('Destination run: ', name, payload);
    return true;
  }

  finalize() {
    super.finalize();
  }
}

export class SourceAction {
  constructor(config, destinationAction) {
    this.config = config;
    this.status = 'CREATED';
    this.error = null;
    this.destination = destinationAction;

    let privateIsRunning = false;
    this.getRunning = function () { // eslint-disable-line func-names
      return privateIsRunning;
    };

    this.setRunning = function (state) { // eslint-disable-line func-names
      privateIsRunning = state;
    };

    // job object s implemented as a "private" so that implementation changes
    // doesn't affect child actions.
    let privateJob = null;
    this.startSchedule = function () { // eslint-disable-line func-names
      if (this.config.trigger && this.config.trigger.schedule) {
        privateJob = schedule.scheduleJob(this.config.trigger.schedule, () => {
          if (!this.getRunning()) {
            this.setRunning(true);
            try {
              this.run();
            } catch (e) {
              console.log('====[ action run failed. ', this.config);
              this.setError(e);
            } finally {
              this.setRunning(false);
            }
          } else {
            console.log('~~~~[ previous run not completed yet!', this.config);
          }
        });
      }
    };

    this.stopSchedule = function () { // eslint-disable-line func-names
      if (privateJob) {
        privateJob.cancel();
        privateJob = null;
      }
    };

    console.log('SourceAction.constructor: ', this.config);
  }

  setStatus(status) {
    this.status = status;
  }

  printStatus() {
    if (this.status !== 'ERROR') {
      console.log(this.status);
    } else {
      this.printError();
    }
  }

  printError() {
    // TODO: I think we should pass Error class objects and print them through
    // the class rather than at location of error. We can properly capture lineNos
    // and other information as well as have custom print for different error types
    console.log('ERROR: ', this.error);
  }

  setError(error) {
    this.error = error;
    this.setStatus('ERROR');
    // TODO: Could possibly send some notification to ui element
    // or use the reporter to send the error to google-analytics
  }

  clearError() {
    this.error = null;
    if (this.status === 'ERROR') {
      this.status = 'READY';
    }
  }

  /**
   * Any operation that can throw an exception none trivial setup should occur
   * here instead of the constructor.
   */
  init() {
    console.log('SourceAction.init: ', this.config);
  }

  // run is only called if it is not running already. If a previous run job is
  // taking a while, the one that was going to fire off is skipped.
  run() {
    console.log('SourceAction.run: ', this.config);
    return true;
  }

  finalize() {
    console.log('SourceAction.finalize: ', this.config);
    this.stopSchedule();
  }
}

// export { SourceAction, DestinationAction };
