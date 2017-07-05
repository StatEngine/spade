import { DestinationAction } from './actions';

export default class DestinationS3Action extends DestinationAction {
  constructor(conf) {
    super(conf);
    this.type = 'S3Destination';
    console.log('S3Destination.constructor: ', this.conf);
  }

  run(filename) {
    console.log('S3Destination.run sending file to S3: ', filename, this.conf);
    return true;
  }

  finalize() {
    console.log('S3Destination.finalize: ', this.conf);
  }
}
