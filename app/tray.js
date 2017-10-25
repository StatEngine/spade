import { app, Tray, Menu, dialog } from 'electron';
import path from 'path';
import serviceHelper from './service-helper';
import gitState from './git-state.json';

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
      'icon-trayTemplate.png');

    this.iconTrayAlert = path.join(__dirname, 'images',
      this.icons[process.platform].dir, this.icons[process.platform].iconAlert ||
      'icon-tray-alert.png');

    console.log('----[ this.iconTray: ', this.iconTray);

    this.showServiceCommands = serviceHelper.appMode() === 'installed';

    this.createAppTray();
  }

  createAppTray() {
    console.log('----[ TrayControl.createAppTray');
    const tray = new Tray(this.iconTray);
    if (this.mainWindow.tray) {
      console.log('====[ mainWindow.tray already has a tray?');
    }
    this.mainWindow.tray = tray;

    setInterval(() => {
      const status = serviceHelper.status();
      if (status !== this.lastStatus) {
        const icon = status !== 'Started' ? this.iconTrayAlert : this.iconTray;
        this.mainWindow.tray.setImage(icon);
        this.lastStatus = status;
      }
    }, 5000);

    const self = this;
    const serviceMenuItems = [
      {
        label: 'ServiceStatus',
        visible: this.showServiceCommands,
        click() {
          const status = serviceHelper.status();
          dialog.showMessageBox({
            title: 'tray',
            message: status ? status : '< none >',
          });
          console.log('----[ status: ', status);
        },
      },
      {
        label: 'ServiceStatusOld',
        visible: this.showServiceCommands,
        click() {
          const status = serviceHelper.statusOld();
          dialog.showMessageBox({
            title: 'tray',
            message: status ? status : '< none >',
          });
          console.log('----[ status: ', status);
        },
      },
      {
        label: 'ServiceAdd',
        visible: this.showServiceCommands,
        click() {
          serviceHelper.add();
        },
      },
      {
        label: 'ServiceRemove',
        visible: this.showServiceCommands,
        click() {
          serviceHelper.remove();
        },
      },
      {
        label: 'ServiceStart',
        visible: this.showServiceCommands,
        click() {
          serviceHelper.start();
        },
      },
      {
        label: 'ServiceStop',
        visible: this.showServiceCommands,
        click() {
          serviceHelper.stop();
        },
      },
      {
        label: 'ServiceAddFull',
        visible: this.showServiceCommands,
        click() {
          serviceHelper.addFull();
        },
      },
      {
        label: 'ServiceAddFullBat',
        visible: this.showServiceCommands,
        click() {
          serviceHelper.addFullBat();
        },
      },
      {
        label: 'ServiceRemoveFull',
        visible: this.showServiceCommands,
        click() {
          serviceHelper.removeFull();
        },
      },
      {
        label: 'ServiceRemoveFullBat',
        visible: this.showServiceCommands,
        click() {
          serviceHelper.removeFullBat();
        },
      },
    ];

    let commonMenuItems = [
      {
        label: 'Quit',
        click() {
          app.quit();
        },
      },
      {
        label: 'AppMode',
        click() {
          const val = serviceHelper.appMode();
          dialog.showMessageBox({
            title: 'tray',
            message: val ? val : '< none >',
          });
          console.log('----[ appMode: ', val);
        },
      },
      {
        label: 'About',
        click() {
          dialog.showMessageBox({
            title: 'About',
            message: `branch: ${gitState.branch}\r\ncommited: ${gitState.commitDate}\r\nSHA: ${gitState.commit}`,
          });
        },
      },
    ];

    if (serviceHelper.appMode() === 'installed') {
      commonMenuItems = commonMenuItems.concat(serviceMenuItems);
    }

    const contextMenuShow = Menu.buildFromTemplate([
      {
        label: 'Show',
        click() {
          self.mainWindow.show();
        },
      },
    ].concat(commonMenuItems));

    const contextMenuHide = Menu.buildFromTemplate([
      {
        label: 'Hide',
        click() {
          self.mainWindow.hide();
        },
      },
    ].concat(commonMenuItems));

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
    const iconPath = path.join(__dirname, 'images', this.icons[process.platform].dir, 'tray-on.ico');
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


// export singleton instance
const trayControl = new TrayControl();
export default trayControl;
