import { app } from 'electron';
import electronSquirrelStartup from 'electron-squirrel-startup';
import yargs from 'yargs';

// handle windows squirrel events. Needs to be top of the app
if (electronSquirrelStartup) {
  app.quit();
}

const argv = yargs.argv;
console.log('----[ argv: ', argv);

if (argv.ui) {
  console.log('----[ spade: running as UI');
  require('./spade-ui'); // eslint-disable-line f global-require
} else {
  console.log('----[ spade: running as Service');
  require('./spade-service'); // eslint-disable-line f global-require
}
