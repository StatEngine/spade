import { app, Tray, Menu } from 'electron';
import path from 'path';

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

  createAppTray() {
    console.log('----[ TrayControl.createAppTray');
    const tray = new Tray(this.iconTray);
    if (this.mainWindow.tray) {
      console.log('====[ mainWindow.tray already has a tray?');
    }
    this.mainWindow.tray = tray;

    const contextMenuShow = Menu.buildFromTemplate([{
      label: 'Show',
      click() {
        this.mainWindow.show();
      },
    }, {
      label: 'Quit',
      click() {
        app.quit();
      },
    }]);

    const contextMenuHide = Menu.buildFromTemplate([{
      label: 'Hide',
      click() {
        this.mainWindow.hide();
      },
    }, {
      label: 'Quit',
      click() {
        app.quit();
      },
    }]);

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
