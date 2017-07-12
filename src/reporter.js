import querystring from 'querystring';
import { spade } from '../spade.js';

export default class Reporter {

  static post(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.send(null);
  }

  request(url) {
    return this.post(url);
  }

  static consented() {
    return spade.settings.get('state.consented') === true;
  }

  static getReleaseChannel() {
    const version = spade.getVersion();
    if (version.indexOf('beta') > -1) {
      return 'beta';
    } else if (version.indexOf('dev') > -1) {
      return 'dev';
    }
    return 'stable';
  }

  static getOsArch() {
    return (process.platform === 'win32' &&
    process.env.PROCESSOR_ARCHITEW6432 === 'AMD64') ? 'x64' : process.arch;
  }

  send(params) {
    if (typeof (navigator) === 'undefined' || !navigator.onLine) {
      return;
    }
    Object.assign(params, {
      v: 1,
      aip: 1,
      tid: 'UA-101004422-2',
      cid: spade.settings.get('state').deparmentId,
      an: 'spade',
      av: spade.getVersion(),
    });

    if (this.consented()) {
      Object.assign(params, this.consentedParams());
    }

    this.request(`https://ssl.google-analytics.com/collect?${querystring.stringify(params)}`);
  }

  sendEvent(category, action, label, value) {
    const params = {
      t: 'event',
      ec: category,
      ea: action,
    };

    if (label) { params.el = label; }
    if (value) { params.ev = value; }

    return this.send(params);
  }

  sendTiming(category, name, value) {
    const params = {
      t: 'timing',
      utc: category,
      utv: name,
      utt: value,
    };
    this.send(params);
  }

  sendException(description) {
    const params = {
      t: 'exception',
      exd: description,
    };
    return this.send(params);
  }

  consentedParams() {
    const memUse = process.memoryUsage();
    return {
      cd2: this.getOsArch(),
      cd3: process.arch,
      cm1: memUse.heapUsed >> 20, // eslint-disable-line no-bitwise, bytes to mb
      cm2: Math.round((memUse.heapUsed / memUse.heapTotal) * 100),
      sr: `${screen.width}x${screen.height}`,
      vp: `${innerWidth}x${innerHeight}`,
      aiid: this.getReleaseChannel(),
    };
  }
}
