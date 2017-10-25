/* eslint global-require: 1, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow } from 'electron';
import path from 'path';
import MenuBuilder from './menu';
import reporter from './reporter';
import tray from './tray';
import spade from './spade';
import serviceHelper from './service-helper';

let mainWindow = null;
let quitApp = false;

export default function init() {
  // make sure only one version of the app can be ran.
  const isSecondInstance = app.makeSingleInstance(() => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.show();
      mainWindow.focus();
    }
  });

  if (isSecondInstance) {
    console.log('=================================================================================================');
    console.log('====[ ERROR: attempt to launch second instance of app while another instance is running. Exiting!!');
    console.log('=================================================================================================');
    app.quit();
  }

  const sessionLoadTime = Date.now();

  if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();
  }

  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    require('electron-debug')();
    const path = require('path');
    const p = path.join(__dirname, '..', 'app', 'node_modules');
    require('module').globalPaths.push(p);
  }

  const installExtensions = async () => {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS',
    ];

    return Promise
      .all(extensions.map(name => installer.default(installer[name], forceDownload)))
      .catch(console.log);
  };

  // TODO: this wont be availabe to render thread
  let modeInstalled = false;
  let modeDevelopment = false;
  let modeProduction = false;
  let modeCounter = 0;
  let mode = null;

  if (process.env.NODE_ENV === 'development') {
    mode = 'development';
    modeDevelopment = true;
    modeCounter += 1;
  }

  if (process.env.NODE_ENV === 'production') {
    mode = 'production';
    modeProduction = true;
    modeCounter += 1;
  }

  if (process.argv[0] && process.argv[0].toLowerCase().endsWith('spade.exe')) {
    mode = 'installed';
    modeInstalled = true;
    modeCounter += 1;
  }

  let appPath = null;
  const dirname = __dirname;

  if (app && app.getAppPath && app.getAppPath()) {
    appPath = app.getAppPath();
  }

  console.log('~~~~[ Application Info: ');
  console.log('        serviceHelper.appMode: ', serviceHelper.appMode());
  console.log('        mode: ', mode);
  console.log('        modeDevelopment: ', modeDevelopment);
  console.log('        modeProduction: ', modeProduction);
  console.log('        modeInstalled: ', modeInstalled);
  console.log('        __dirname: ', dirname);
  console.log('        app.getAppPath: ', appPath);
  console.log('        env: ', process.env);

  if (modeCounter !== 1 &&
    // when in installed mode, production flag is also true, which is okay
     !(modeCounter === 2 && modeProduction && modeInstalled)) {
    throw Error(`Application mode error! mode count: ${modeCounter}`);
  }

  const createWindow = async () => {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
      await installExtensions();
    }

    mainWindow = new BrowserWindow({
      show: false,
      width: 1024,
      height: 728,
      icon: path.join(__dirname, 'images/windows/stat-engine.ico')
    });

    mainWindow.loadURL(`file://${__dirname}/app.html`);

    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    mainWindow.webContents.on('did-finish-load', () => {
      if (!mainWindow) {
        throw new Error('"mainWindow" is not defined');
      }
      mainWindow.show();
      mainWindow.focus();
    });

    mainWindow.on('close', (e) => {
      // if we are just closing the window, but app is not in installed mode
      // quite the app as well. meant for developers...
      if (serviceHelper.appMode() !== 'installed') {
        app.quit();
      }

      if (quitApp) {
        // the user tried to quit the app as opposed closing windows
        mainWindow = null;
      } else {
        // the user only tried to close the window
        e.preventDefault();
        mainWindow.hide();
      }
    });

    mainWindow.on('closed', () => {
      reporter.sendTiming('spade', 'sessionDuration', Date.now() - sessionLoadTime);
    });
  };

  /**
   * Add event listeners...
   */
   // This method will be called when Electron has finished
   // initialization and is ready to create browser windows.
   // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    // TODO: should init spade here, but doing it in html for easier debugging
    // through the browser debugger instead of output to shell
    createWindow().then(() => {
      // TODO: should either of these happen in createWindow?
      tray.init(mainWindow);
      const menuBuilder = new MenuBuilder(mainWindow);
      menuBuilder.buildMenu();

      spade.init();
    });
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    mainWindow.show();
  });

  // 'before-quit' is emitted when Electron receives
  // the signal to exit and wants to start closing windows
  app.on('before-quit', () => {
    quitApp = true;
  });

  app.on('window-all-closed', () => {
    console.log('----[ all windows have been closed, not quitting. Can only quit app from tray icon');
  });
}
