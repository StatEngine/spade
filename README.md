
#Getting Started

## Prerequisite
Install latest stable nodejs https://nodejs.org/en/download/
npm install -g electron-forge

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
