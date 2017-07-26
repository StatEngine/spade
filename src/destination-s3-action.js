import fs from 'fs';
import path from 'path';
import S3 from 'aws-sdk/clients/s3';
import { DestinationAction } from './actions';


class S3Error extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, S3Error);
  }
}

export default class DestinationS3Action extends DestinationAction {
  constructor(config) {
    super(config);
    this.client = null;
    console.log('S3Destination.constructor: ', this.config);
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
      accessKeyId: this.config.s3.accessKeyId,
      secretAccessKey: this.config.s3.secretAccessKey,
    });
    const testParams = {
      Bucket: this.config.s3.Bucket,
    };
    this.client.headBucket(testParams, (err, data) => {
      if (err) {
        this.setError(new S3Error(err));
        console.log(err);
      } else {
        this.setStatus('READY');
        console.log('S3 Bucket Valid and accessible', data);
      }
    });
  }

  run(name, payload) {
    return new Promise((resolve, reject) => {
      let writePayload = payload;
      let keyName = name;
      if (writePayload == null) {
        // Assuming file on filesystem
        try {
          writePayload = fs.readFileSync(name);
        } catch (e) {
          writePayload = null;
          console.log('Unable to read file', e);
          reject(e);
        }
        keyName = path.basename(keyName);
      }
      const s3Params = {
        Body: writePayload,
        Key: keyName,
        Bucket: this.config.s3.Bucket,
      };
      this.uploadToS3(s3Params, (s3Err, s3Data) => {
        if (s3Err) {
          this.setError(s3Err);
          console.log('Could not upload file to s3: ', s3Params.Key, s3Err.stack);
          reject(s3Err);
        } else {
          console.log('File Uploaded to s3: ', s3Data);
          resolve(s3Data);
        }
      });
    });
  }

  finalize() {
    console.log('S3Destination.finalize: ', this.config);
    this.setStatus('SHUTDOWN');
  }
}
