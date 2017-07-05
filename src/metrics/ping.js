import {Reporter} from './reporter';

class Ping {
  constructor(interval=3600) {
    this.interval = interval;
    this.reporter = new Reporter();
  }

  start() {
    var self = this;
    if (self._ping) return;

    self._ping = window.setInterval(function() {
      self.reporter.sendEvent('core.telemetry', 'ping');
    }, this.interval * 1000)
  }

  stop() {
    var self = this;
    if (!self._ping) return;
    clearInterval(self._ping);
  }
}

module.exports = {
  Ping
}
