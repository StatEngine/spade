import fs from 'fs';
import path from 'path';

import S3 from 'aws-sdk/clients/s3';
import { DestinationAction } from './actions';


export default class DestinationS3Action extends DestinationAction {
  constructor(conf) {
    super(conf);
    this.client = null;
    console.log('S3Destination.constructor: ', this.conf);
  }

  uploadToS3(params, callback) {
    return this.client.upload(params, callback);
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
    /*
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
    */
  }

  run(name, payload) {
    return new Promise((resolve, reject) => {
      let writePayload = payload;
      let keyName = name;
      if (writePayload == null) {
        // Assuming file on filesystem
        writePayload = fs.readFileSync(name);
        keyName = path.basename(keyName);
      }
      const s3Params = {
        Body: writePayload,
        Key: keyName,
        Bucket: this.conf.s3.Bucket,
      };
      this.uploadToS3(s3Params, (s3Err, s3Data) => {
        if (s3Err) {
          console.log('Could not upload file to s3: ', s3Params.Key, s3Err.stack);
          reject();
        } else {
          console.log('File Uploaded to s3: ', s3Data);
          resolve();
        }
      });
    });
  }

  finalize() {
    console.log('S3Destination.finalize: ', this.conf);
  }
}
