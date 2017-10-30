/* eslint global-require: 1 */
import yargs from 'yargs';
import initUi from './spade-ui';
import initService from './spade-service';

console.log('----[ process.argv: ', process.argv);

// when running as binary app on windows or osx with no param, the only arg is
// the exe/app. When running as node app, first arg is node, second main js.
// The arg parsers seem to ignore first two args. So when running as app/exe
// need to put a path as second arg.
const argv = yargs.argv;

function usage() {
  console.log('Usage: spade -- [ options ]');
  console.log('       (note the extra --) ');
  console.log('Options:');
  console.log(' --service        run as a service without ui');
  console.log(' --ui             show the ui, AND run the service portion on the render thread ONLY when not in "installed" mode.');
  console.log(' --help           print usage');
}

console.log('----[ argv: ', argv);

if (argv.help) {
  usage();
} else if (argv.service) {
  console.log('----[ spade: running as --service');
  initService();
} else {
  console.log('----[ spade: running as --ui');
  usage();
  initUi();
}
