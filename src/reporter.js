import querystring from 'querystring';
import spade from './spade';

export default class Reporter {
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

  static send(params) {
    console.log('----[ send: ', params);
    if (typeof (navigator) === 'undefined' || !navigator.onLine) {
      return;
    }
    Object.assign(params, {
      v: 1,
      aip: 1,
      tid: 'UA-101004422-2',
      cid: spade.getDepartmentId(),
      an: 'spade',
      av: spade.getVersion(),
    });

    if (spade.getHasUserConsent()) {
      Object.assign(params, Reporter.consentedParams());
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://ssl.google-analytics.com/collect?${querystring.stringify(params)}`);
    xhr.send(null);
  }

  static sendEvent(category, action, label, value) {
    const params = {
      t: 'event',
      ec: category,
      ea: action,
    };

    if (label) { params.el = label; }
    if (value) { params.ev = value; }

    return Reporter.send(params);
  }

  static sendTiming(category, name, value) {
    const params = {
      t: 'timing',
      utc: category,
      utv: name,
      utt: value,
    };
    Reporter.send(params);
  }

  static sendException(description) {
    const params = {
      t: 'exception',
      exd: description,
    };
    return Reporter.send(params);
  }

  static consentedParams() {
    const memUse = process.memoryUsage();
    return {
      cd2: Reporter.getOsArch(),
      cd3: process.arch,
      cm1: memUse.heapUsed >> 20, // eslint-disable-line no-bitwise, bytes to mb
      cm2: Math.round((memUse.heapUsed / memUse.heapTotal) * 100),
      sr: `${screen.width}x${screen.height}`,
      vp: `${innerWidth}x${innerHeight}`,
      aiid: Reporter.getReleaseChannel(),
    };
  }
}
