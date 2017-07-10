import S3 from 'aws-sdk/clients/s3';
import { DestinationAction } from './actions';

export default class DestinationS3Action extends DestinationAction {
  constructor(conf) {
    super(conf);
    this.client = null;
    console.log('S3Destination.constructor: ', this.conf);
  }

  init() {
    this.client = new S3({
      maxRetries: 3,
      retryDelayOptions: {
        base: 1000,
      },
      multipartUploadThreshold: 20971520, // this is the default (20 MB)
      multipartUploadSize: 15728640, // this is the default (15 MB)
      accessKeyId: this.conf.s3.accessKeyId,
      secretAccessKey: this.conf.s3.secretAccessKey,
    });

    // TODO: test bucket for write access?
    const testParams = {
      Body: JSON.stringify({ Test: 'Blah' }),
      Bucket: this.conf.s3.Bucket,
      Key: 'testFile.json',
    };
    this.client.upload(testParams, (err, data) => {
      if (err) {
        this.status = 'ERROR';
        console.log('unable to upload', err.stack);
      } else {
        this.status = 'READY';
        console.log('Test file uploaded', data);
      }
    });
  }

  run(data) {
    let type = 'filename';
    if (typeof data !== 'string') {
      type = 'object';
    }
    return new Promise((resolve, reject) => {
      if (type === 'object') {
        reject();
      } else {
        console.log('S3Destination.run sending file to S3: ', type,
        this.conf);
        resolve();
      }
    });
  }

  finalize() {
    console.log('S3Destination.finalize: ', this.conf);
  }
}
