import path from 'path';
import runas from 'runas';
import childProcess from 'child_process';

export default class ServiceHelper {
  static get dirname() {
    // this works for installed and (mostly) production mode which are the main
    // ones we care about. Note that ServiceHelper should only be used in
    // installed mode untill we make it so that in dev/production, it uses
    // Spade singleton directly instead of install as windows service.
    return path.join(__dirname, 'service');
  }

  static get EXE() {
    const p = path.join(ServiceHelper.dirname, 'spade-service.exe');
    //console.log(`----[ path to exe: "${p}"\n`);
    return `"${p}"`;
  }

  static get OPS() {
    return {
      hide: true,
      admin: true,
      catchOutput: true,
    };
  }

  static appMode() {
    let mode = '';
    if (process.argv[0] && process.argv[0].toLowerCase().endsWith('spade.exe')) {
      mode = 'installed';
    } else if (process.env.NODE_ENV === 'production') {
      mode = 'production';
    } else if (process.env.NODE_ENV === 'development') {
      mode = 'development';
    }
    return mode;
  }

  static execute(args) {
    return new Promise((resolve, reject) => {
      childProcess.execFile(ServiceHelper.EXE, args, { encoding: 'utf16le' },
        (error, stdout, stderr) => {
          // Convert Buffer to String and remove trailing EOLs
          const stdoutStr = stdout.toString('utf8').trim();
          const stderrStr = stderr.toString('utf8').trim();
          let err = error;
          // Treat warnings on stderr as error
          if (stderrStr && !err) {
            err = new Error(stderrStr);
          }
          // ENOENT
          if (err && err.code === 'ENOENT') {
            err = new Error('spade-service not found.');
          }
          // Handle error
          if (err) {
            reject(err);
          } else {
            resolve(stdoutStr);
          }
        });
    });
  }

  static isStarted() {
    if (ServiceHelper.getStatus() === 'Started') {
      return true;
    }
    return false;
  }

  static isStopped() {
    if (ServiceHelper.getStatus().toLowerCase() === 'Stopped') {
      return true;
    }
    return false;
  }

  static isNonExistent() {
    if (ServiceHelper.getStatus().toLowerCase() === 'NonExistent') {
      return true;
    }
    return false;
  }

  // valid states: Started, Stopped, NonExistent
  // Invalid if something is wrong
  static status() {
    let status = null;
    try {
      status = childProcess.execSync(`${ServiceHelper.EXE} status`);
      status = status.toString('utf8').trim();
    } catch (e) {
      status = 'Invalid'
      console.log(`----[ status: ${status}\n`);
      console.log(new Error().stack);
    }
    //console.log(`----[ status: ${status}\n`);
    return status;
  }

  // Note: running with runas doesn't return the response of status.
  //       test other forks of runas if needed
  static statusOld() {
    const out = runas(ServiceHelper.EXE, ['status'], {
      hide: true,
      admin: false,
      catchOutput: true,
    });
    console.log('----[ statusOld: ', out);
    return out;
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
    const p = path.join(ServiceHelper.dirname, 'service-install-full.bat');
    const exe = `"${p}"`;
    let output1 = null;
    output1 = runas(exe, [], ServiceHelper.OPS);
    console.log('----[ addFullBat, exe: ', exe);
    console.log('----[ addFullBat, output: ', output1);
  }

  static removeFullBat() {
    const p = path.join(ServiceHelper.dirname, 'service-uninstall-full.bat');
    const exe = `"${p}"`;
    let output1 = null;
    output1 = runas(exe, [], ServiceHelper.OPT);
    console.log('----[ addFullBat, exe: ', exe);
    console.log('----[ addFullBat, output: ', output1);
  }
}
