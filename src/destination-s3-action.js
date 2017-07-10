import s3 from 's3';

import { DestinationAction } from './actions';

export default class DestinationS3Action extends DestinationAction {
  constructor(conf) {
    super(conf);
    this.client = null;
    console.log('S3Destination.constructor: ', this.conf);
  }

  init() {
    this.client = s3.createClient({
      maxAsyncS3: 20,
      s3RetryCount: 3,
      s3RetryDelay: 1000,
      multipartUploadThreshold: 20971520, // this is the default (20 MB)
      multipartUploadSize: 15728640, // this is the default (15 MB)
      s3Options: this.conf.s3,
    });

    // TODO: test bucket for write access?
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
