import schedule from 'node-schedule';

export class DestinationAction {
  constructor(conf) {
    this.conf = conf;
    console.log('DestinationAction.constructor: ', this.conf);
  }

  /**
   * Any operation that can throw an exception none trivial setup should occur
   * here instead of the constructor.
   */
  init() {
    console.log('DestinationAction.init: ', this.conf);
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
    let type = 'filename';
    if (typeof data !== 'string') {
      type = 'object';
    }

    console.log('DestinationAction.run: ', this.conf, type, payload);
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
      if (this.conf.trigger && this.conf.trigger.schedule) {
        privateJob = schedule.scheduleJob(this.conf.trigger.schedule, () => {
          if (!this.getRunning()) {
            this.setRunning(true);
            try {
              this.run();
            } catch (e) {
              console.log('====[ action run failed. ', this.conf);
            } finally {
              this.setRunning(false);
            }
          } else {
            console.log('~~~~[ previous run not completed yet!', this.conf);
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

    console.log('SourceAction.constructor: ', this.conf);
  }

  /**
   * Any operation that can throw an exception none trivial setup should occur
   * here instead of the constructor.
   */
  init() {
    console.log('SourceAction.init: ', this.conf);
  }

  // run is only called if it is not running already. If a previous run job is
  // taking a while, the one that was going to fire off is skipped.
  run() {
    console.log('SourceAction.run: ', this.conf);
    return true;
  }

  finalize() {
    console.log('SourceAction.finalize: ', this.conf);
    this.stopSchedule();
  }
}

// export { SourceAction, DestinationAction };
