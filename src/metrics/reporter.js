import querystring from 'querystring';
import {spade} from '../spade.js';

class Reporter {

  post(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.send(null);
  }

  request(url) {
    return this.post(url);
  }

  consented() {
    return spade.settings.get('state.consented') === true;
  }

  getReleaseChannel() {
    var version = spade.getVersion();
    if (version.indexOf('beta') > -1) {
      return 'beta';
    } else if (version.indexOf('dev') > -1) {
      return 'dev';
    } else {
      return 'stable';
    }
  }

  getOsArch() {
    return (process.platform === 'win32' &&
    process.env.PROCESSOR_ARCHITEW6432 === 'AMD64') ? 'x64' : process.arch
  }

  send(params) {
    if (typeof(navigator) === "undefined" || !navigator.onLine) {
      return;
    }
      Object.assign(params, {
        v: 1,
        aip: 1,
        tid: 'UA-101004422-2',
        cid: spade.settings.get('state').deparmentId,
        an: 'spade',
        av: spade.getVersion()
      });

      if (this.consented()) {
        Object.assign(params, this.consentedParams());
      }

      this.request(`https://ssl.google-analytics.com/collect?${querystring.stringify(params)}`)
  }

  sendEvent(category, action, label, value) {
      var params = {
        t: 'event',
        ec: category,
        ea: action
      }

      if(label) { params.el = label; }
      if(value) { params.ev = value; }

      return this.send(params);
  }

  sendTiming (category, name, value) {
    var params = {
      t: 'timing',
      utc: category,
      utv: name,
      utt: value
    }
    this.send(params)
  }

  sendException(description) {
    var params = {
      t: 'exception',
      exd: description
    }
    return this.send(params);
  }

  consentedParams() {
    var memUse = process.memoryUsage();
    return {
      cd2: this.getOsArch(),
      cd3: process.arch,
      cm1: memUse.heapUsed >> 20,
      cm2: Math.round((memUse.heapUsed / memUse.heapTotal) * 100),
      sr: `${screen.width}x${screen.height}`,
      vp: `${innerWidth}x${innerHeight}`,
      aiid: this.getReleaseChannel()
    }
  }
}

module.exports = {
  Reporter
}
