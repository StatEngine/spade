import DestinationS3Action from './destination-s3-action';
import SourceFileWatchAction from './source-file-watch-action';

export default function init() {
  console.log('DestinationS3Action: ', DestinationS3Action);
  // the config file shold be loaded dynamically when init is called as it might
  // have changed by the UI; hence, not using import top of the file and
  // diabling linter error.
  const config = require('./actions.json');  // eslint-disable-line global-require
  console.log('loaded config: ', config);
  const destination = new DestinationS3Action(config.destinations.incidents);
  const source = new SourceFileWatchAction(config.sources.cadFiles, destination);
  source.run();
}
