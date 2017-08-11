import path from 'path';
import runas from 'runas';
import childProcess from 'child_process';

export default class ServiceHelper {
  static get EXE() {
    return path.join(__dirname, 'service', 'spade-service.exe');
  }

  static get OPS() {
    return {
      hide: true,
      admin: true,
      catchOutput: true,
    };
  }

  static isRunning() {
    if (ServiceHelper.getStatus() === 'started') {
      return true;
    }
    return false;
  }

  static status() {
    const out = childProcess.execFileSync(`"${ServiceHelper.EXE}"`, ['status']);
    console.log(`----[ getStatus: ${out}\n`);
    return out;
  }

  // Note: running with runas doesn't return the response of status.
  static statusOld() {
    const opts = {
      hide: true,
      admin: false,
      catchOutput: true,
    };
    let output1 = null;
    output1 = runas(ServiceHelper.EXE, ['status'], opts);
    console.log('----[ serviceStatus: ', output1);
    return output1;
  }

  static add() {
    return runas(ServiceHelper.EXE, ['install'], ServiceHelper.OPS);
  }

  static remove() {
    return runas(ServiceHelper.EXE, ['uninstall'], ServiceHelper.OPS);
  }

  static start() {
    return runas(ServiceHelper.EXE, ['start'], ServiceHelper.OPS);
  }

  static stop() {
    return runas(ServiceHelper.EXE, ['stop'], ServiceHelper.OPS);
  }

  static addFull() {
    const output1 = ServiceHelper.stop();
    setTimeout(() => {
      const output2 = ServiceHelper.remove();
      setTimeout(() => {
        const output3 = ServiceHelper.add();
        setTimeout(() => {
          const output4 = ServiceHelper.start();
          console.log('----[ addFull: ', output1, output2, output3, output4);
        }, 4);
      }, 4);
    }, 4);
  }

  static removeFull() {
    const output1 = ServiceHelper.stop();
    setTimeout(() => {
      const output2 = ServiceHelper.remove();
      console.log('----[ removeFull: ', output1, output2);
    }, 4);
  }

  static addFullBat() {
    const exe = path.join(__dirname, 'service', 'service-install-full.bat');
    let output1 = null;
    output1 = runas(exe, [], ServiceHelper.OPS);
    console.log('----[ addFullBat: ', output1);
  }

  static removeFullBat() {
    const exe = path.join(__dirname, 'service', 'service-uninstall-full.bat');
    let output1 = null;
    output1 = runas(exe, [], ServiceHelper.OPT);
    console.log('----[ removeFullBat: ', output1);
  }
}
