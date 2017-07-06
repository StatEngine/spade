import { DestinationAction } from './actions';

export default class DestinationS3Action extends DestinationAction {
  constructor(conf) {
    super(conf);
    this.type = 'S3Destination';
    console.log('S3Destination.constructor: ', this.conf);
  }

  run(filename) {
    return new Promise((resolve, reject) => {
      if (!filename) {
        reject();
      } else {
        console.log('S3Destination.run sending file to S3: ', filename,
        this.conf);
        resolve();
      }
    });
  }

  finalize() {
    console.log('S3Destination.finalize: ', this.conf);
  }
}
