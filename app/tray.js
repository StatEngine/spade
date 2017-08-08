import { app, Tray, Menu } from 'electron';
import path from 'path';
import runas from 'runas';
import util from 'util';
import child_process from 'child_process';

class TrayControl {
  init(mainWindow) {
    console.log('----[ TrayControl.init');
    this.mainWindow = mainWindow;
    this.icons = {
      win32: {
        dir: 'windows',
      },

      linux: {
        dir: 'linux',
      },

      darwin: {
        dir: 'osx',
        icon: 'icon-trayTemplate.png',
      },
    };

    this.iconTray = path.join(__dirname, 'images',
      this.icons[process.platform].dir, this.icons[process.platform].icon ||
      'icon-tray.png');

    this.iconTrayAlert = path.join(__dirname, 'images',
      this.icons[process.platform].dir, this.icons[process.platform].iconAlert ||
      'icon-tray-alert.png');

    console.log('----[ this.iconTray: ', this.iconTray);

    this.createAppTray();
  }

  serviceAdd() {
    const exe = path.join(__dirname, 'nssm', 'win64', 'nssm.exe');
    const opts = {
      hide: true,
      admin: true,
      catchOutput: true,
    };
    let output1, output2, output3, output4, output5, output6, output7, output8, output9, output10 = null;
    output1 = runas(exe, ['stop', 'spade'], opts);
    setTimeout(function () {
      output2 = runas(exe, ['remove', 'spade', 'confirm'], opts);
      setTimeout(function() {
        output3 = runas(exe, ['install', 'spade', 'C:\\Users\\syrusm\\AppData\\Local\\Programs\\spade\\spade.exe'], opts);
        output4 = runas(exe, ['set', 'spade', 'AppParameters', '--', '--service'], opts);
        output5 = runas(exe, ['set', 'spade', 'AppRotateFiles', '1'], opts);
        output6 = runas(exe, ['set', 'spade', 'AppRotateOnline', '1'], opts);
        output7 = runas(exe, ['set', 'spade', 'AppRotateBytes', '10000000'], opts);
        output8 = runas(exe, ['set', 'spade', 'AppStdout', 'C:\\Users\\syrusm\\AppData\\Local\\Programs\\spade\\log.txt'], opts);
        output9 = runas(exe, ['set', 'spade', 'AppStderr', 'C:\\Users\\syrusm\\AppData\\Local\\Programs\\spade\\log.txt'], opts);
        output10 = runas(exe, ['start', 'spade'], opts);
        console.log('----[ serviceAdd: ', output1, output2, output3, output4, output5, output6, output7, output8, output9, output10);
      }, 4);
    }, 4);
  }

  serviceRemove() {
    const exe = path.join(__dirname, 'nssm', 'win64', 'nssm.exe');
    const opts = {
      hide: true,
      admin: true,
      catchOutput: true,
    };
    let output1, output2 = null;
    output1 = runas(exe, ['stop', 'spade'], opts);
    setTimeout(function () {
      output2 = runas(exe, ['remove', 'spade', 'confirm'], opts);
      console.log('----[ serviceRemove: ', output1, output2);
    }, 4);
  }

  serviceRest() {
    const exe = path.join(__dirname, 'nssm', 'service-reset.bat');
    const opts = {
      hide: true,
      admin: true,
      catchOutput: true,
    };
    let output1 = null;
    output1 = runas(exe, [], opts);
    console.log('----[ serviceRest: ', output1);
  }

  serviceStatus() {
    const exe = path.join(__dirname, 'nssm', 'win64', 'nssm.exe');
    const opts = {
      hide: true,
      admin: false,
      catchOutput: true,
    };
    let output1 = null;
    output1 = runas(exe, ['status', 'spade'], opts);
    console.log('----[ serviceStatus: ', output1);
  }

  serviceStatus2() {
    const exe = path.join(__dirname, 'nssm', 'win64', 'nssm.exe');
    const out = child_process.execSync(`"${exe}" status spade`);
    console.log(`----[ serviceStatus2 out: ${out}`);
    /*
    child_process.exec(`"${exe}" status spade`, (err, stdout, stderr) => {
      if (err) {
        console.log('----[ serviceStatus2 error!');
        return;
      }
      console.log(`----[ serviceStatus2 stdout: ${stdout}`);
      console.log(`----[ serviceStatus2 stderr: ${stderr}`);
    });
    */
  }

  createAppTray() {
    console.log('----[ TrayControl.createAppTray');
    const tray = new Tray(this.iconTray);
    if (this.mainWindow.tray) {
      console.log('====[ mainWindow.tray already has a tray?');
    }
    this.mainWindow.tray = tray;
    const self = this;
    const contextMenuShow = Menu.buildFromTemplate([
    {
      label: 'Show',
      click() {
        this.mainWindow.show();
      },
    },
    {
      label: 'Quit',
      click() {
        app.quit();
      },
    }]);

    const contextMenuHide = Menu.buildFromTemplate([
    {
      label: 'Hide',
      click() {
        this.mainWindow.hide();
      },
    },
    {
      label: 'Quit',
      click() {
        app.quit();
      },
    },
    {
      label: 'ServiceStatus',
      click() {
        self.serviceStatus();
      },
    },
    {
      label: 'ServiceStatus2',
      click() {
        self.serviceStatus2();
      },
    },
    {
      label: 'ServiceReset',
      click() {
        self.serviceRest();
      },
    },
    {
      label: 'ServiceAdd',
      click() {
        self.serviceAdd();
      },
    },
    {
      label: 'ServiceRemove',
      click() {
        self.serviceRemove();
      },
    }
    ]);

    if (!this.mainWindow.isMinimized() && !this.mainWindow.isVisible()) {
      tray.setContextMenu(contextMenuShow);
    } else {
      tray.setContextMenu(contextMenuHide);
    }

    const onShow = function onShow() {
      tray.setContextMenu(contextMenuHide);
    };

    const onHide = function onHide() {
      tray.setContextMenu(contextMenuShow);
    };

    this.mainWindow.on('show', onShow);
    this.mainWindow.on('hide', onHide);

    tray.setToolTip(app.getName());

    tray.on('right-click', (e, b) => {
      tray.popUpContextMenu(undefined, b);
    });

    tray.on('click', () => {
      this.mainWindow.show();
    });

    this.mainWindow.destroyTray = function destroyTray() {
      this.mainWindow.removeListener('show', onShow);
      this.mainWindow.removeListener('hide', onHide);
      tray.destroy();
    };
  }

  setImage() {
    // works in no "exe": path.join(__dirname, '..', 'app', 'images', ...
    // did not work with "exe" path.join('images', ...
    // path.join(__dirname, 'images',  worked with exe, npm run dev, and npm start
    const iconPath = path.join(__dirname, 'images', this.icons[process.platform].dir, 'icon-tray.png');
    this.mainWindow.tray.setImage(iconPath);
  }

  showTrayAlert(showAlert, title) {
    if (this.mainWindow.tray === null || this.mainWindow.tray === undefined) {
      return;
    }

    this.mainWindow.flashFrame(showAlert);
    if (process.platform !== 'darwin') {
      this.setImage(title);
    } else {
      if (showAlert) {
        this.mainWindow.tray.setImage(this.iconTrayAlert);
      } else {
        this.mainWindow.tray.setImage(this.iconTray);
      }
      this.mainWindow.tray.setTitle(title);
    }
  }

  removeAppTray() {
    this.mainWindow.destroyTray();
  }

  toggle() {
    if (localStorage.getItem('hideTray') === 'true') {
      this.createAppTray();
      localStorage.setItem('hideTray', 'false');
    } else {
      this.removeAppTray();
      localStorage.setItem('hideTray', 'true');
    }
  }
}


// export singlton instance
const trayControl = new TrayControl();
export default trayControl;
