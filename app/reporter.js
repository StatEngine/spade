import querystring from 'querystring';
import request from 'request';
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

    Object.assign(params, {
      v: 1,
      aip: 1,
      tid: 'UA-101004422-2',
      cid: spade.getDepartmentId(),
      an: 'spade',
      aid: spade.getCommitID(),
      av: spade.getVersion(),
    });

    if (spade.getHasUserConsent()) {
      Object.assign(params, Reporter.consentedParams());
    }

    request.post(`https://ssl.google-analytics.com/collect?${querystring.stringify(params)}`, (err) => {
      if (err) {
        console.log('Could not post to ga: ', err);
      }
    });
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
      aiid: Reporter.getReleaseChannel(),
    };
  }
}
