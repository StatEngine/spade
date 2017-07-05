import {Reporter} from './reporter';
import {spade} from '../spade';

class Metrics {
  constructor(spade) {
    this.reporter = new Reporter();
  }

  start() {
    var self = this;
    this.sessionStart = Date.now();
    this.reporter.sendEvent('core.window', 'started');

    spade.onSettingsChange(function(){
      self.reporter.sendEvent('core.settings', 'change');
    });

    spade.onQuit(this.stop);
  }

  stop() {
    this.reporter.sendEvent('core.window', 'ended');
    this.reporter.sendTiming('core.window', 'sessionDuration', Date.now() - this.sessionStart);
  }

}

export let metrics = new Metrics();
