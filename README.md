
# Getting Started

## Prerequisites
Install exactly nodejs version 7.x from this [link](http://nodejs.org/en/download/releases). Do not install a newer or older version.

Note that any libraries with native files need to be rebuilt for the right version of electro and target platform. This is done by node-gyp and electron-rebuild and they depend on other tools such as python, xcode/msvisual-studio etc native libraries. On windows, do the following. For building on other os see [this](https://github.com/nodejs/node-gyp#on-mac-os-x)
```
npm install --global --production windows-build-tools
```


## Install App Dependancies
to install all the dependancies you should run clean install which will flush npm & yarn caches and remove temp folders such as release. Then the modules un  
```
clean-install.sh
```

## Run
To run the app in `dev` mode where it is completely ran on the render thread so that the browser can be used as the debugger, run the following
```
npm run dev
```

To run in `production` mode
```
nm start
```

To run the installed app, use the desktop shortcut. On windows 7, the path to the exe is:
`C:\Users\<user name>\AppData\Local\Programs\spade`

## Adding dependancies
Note that ALL packages that have native code need to be installed in the `app` folder not the root folder. This project has two `package.json` files and you need to know which to use. All dependencies under the root package json will be webpacked (condensed into one js file) but that cannot occur for modules that have native dependancies. the items under the `app` folder are skipped by the build process. when you run `clean-install.sh` all temp files are rem

## spade-service
You can only run the commands in the `app/service` folder from the installed version of the app, not the repo since the start command relies on the installed version of Spade not you local build of the exe. Note that `start` will fail to actually start the process even though other parts of each command will work.

## Windows Installer
Run the following to make sure the existing release package is first deleted and that your build is based on your latest local package.json with reproducible minor versions. The resulting installer will be in the `release` folder. Note that `clean-package.sh` calls `clean-install.sh` first.
```
clean-package.sh
```

## Development Environment
You should read the entire readme of this [boilerplate](https://github.com/chentsulin/electron-react-boilerplate/tree/v0.12.0) at (1 commit after) the v0.12.0 tag.
install the Atom packages form their readme.
Additional recommendation:
 - enable autosave in Atom settings which will save the files as soon as the pane loses focus.

### Paths
Note that the path to a file is different when in the `dev` (`npm run dev`) and `production` (`npm start`) builds which are also different that the installed copy of the application (`desktop shortcut`). In`dev` mode, the js files will be in temp `dll` folder in the repo. The `production` mode runs it out of `./app` folder. As a result, the `__dirname` can resolve to different folders.  

### Windows Shell
When developing windows, do not use the cmd shell. Use a bash shell (for example the shell that comes with git) so that a new shell is not launched to run the `.sh` files and then immediately closed. If you are not in a bash shell, and there is an error, you wont see it.

# Troubleshooting
- When in `production` or `installed` mode, setting `DEBUG_PROD` env var to `'true'` (in quotes) and restarting the bash shell you have open. You can search for 'env' on the start menu to open the appropriate window to set the variable.
- If clicking Spade does not do anything:
  - click the quit option on any Spade tray icon's context/right-click menu
  - make sure in task manage you do not have any Spade process running
  - make sure in task manager you do not see any node.exe running
  - try re-launching from shortcut
- When you close the Spade main window, it is still running. If you try to launch the app again, it will just show the main window of the running app. You have to use the Quit option from the tray icon to exit.
- Virus scanner might consider the spade-service.exe as malicious. Its existence or execution is not a concern unless it has been infected while on your network and the virus scanner has specifically found it to contain a particular virus.
