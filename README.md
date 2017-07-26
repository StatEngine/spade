
#Getting Started

## Prerequisite
Install nodejs version 7.x


## Install App Dependancies
npm install

## Run
npm start

## Generate Installer
npm make

### Other
electron-forge make --arch ia32 --platform win32
electron-forge make --arch x64 --platform darwin

## get the linter working in atom
apm install linter-eslint

Task's can be scheduled using cron syntax. see this https://crontab.guru

## building installer
on osx brew install rpm
on windows use docker https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build
./node_modules/yarn/bin/yarn add electron-builder --dev
npm run-script dist
