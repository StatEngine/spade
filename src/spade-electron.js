import { ipcRenderer } from 'electron';
import Settings from 'electron-settings';
import EventEmitter from 'events';

import { Ping, metrics } from './metrics';
import { version } from '../package.json';

export class Spade {
  constructor() {
    this.settings = Settings;
    this.events = new EventEmitter();

    this.ready = true;
    this.events.emit('ready');

  }

  ready() {
    return this.ready === true;
  }

  onReady(callback) {
    return this.events.on('ready', callback);
  }

  static onQuit(callback) {
    return ipcRenderer.on('before-quit', callback);
  }

  onSettingsChange(callback) {
    return this.settings.on('change', callback);
  }

  startMetrics() {
    this.metrics = metrics;
    this.metrics.start();
  }

  startHeartbeat() {
    this.heartbeat = new Ping(3600);
    this.heartbeat.start();
  }

  stopHeartbeat() {
    this.heartbeat.stop();
  }

  static getVersion() {
    return version;
  }
}

const spade = new Spade();
export default spade;

// TODO: move to instance
function finishSetup() {
  spade.startMetrics();
  spade.startHeartbeat();
}

if (spade.ready) {
  finishSetup();
} else {
  spade.onReady(finishSetup);
}
