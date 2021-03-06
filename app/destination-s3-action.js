import fs from 'fs';
import path from 'path';
import S3 from 'aws-sdk/clients/s3';
import Promise from 'bluebird';
import { DestinationAction } from './actions';
import Reporter from './reporter';


/* class S3Error extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, S3Error);
  }
} */
export const type = 's3';
export default class DestinationS3Action extends DestinationAction {
  constructor(config) {
    super(config);
    this.client = null;
    // Regex to remove any trailing slashes off of folder name if present
    this.config.s3.folder = this.config.s3.folder.replace(/\/+$/, '');
    this.keyFolderPrefix = `${this.config.s3.folder}/`;
    console.log('S3Destination.constructor: ', this.config);
  }

  // Required module static functions
  static getDefaultConfig(currentConfig) {
    const defaultConfig = {
      bucket: 'departments',
      folder: currentConfig.departmentId || null,
      accessKeyId: null,
      secretAccessKey: null,
    };
    return defaultConfig;
  }

  static validateConfigProperties(config) {
    const requiredConfigurationProps = ['accessKeyId', 'secretAccessKey', 'folder', 'bucket'];
    for (let iProp = 0; iProp < requiredConfigurationProps.length; iProp += 1) {
      const keyName = requiredConfigurationProps[iProp];
      const value = config.s3[keyName];
      if (value === null || value === '') {
        return false;
      }
    }
    return true;
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
      endpoint: 's3.amazonaws.com/data-import-prod-445861113736-us-east-1/departments',
      s3BucketEndpoint: true,
    });
    /*const testParams = {
      Bucket: this.config.s3.bucket,
    };
    this.client.headBucket(testParams, (err, data) => {
      if (err) {
        Reporter.sendException(err);
        console.log(err);
      } else {
        this.setStatus('READY');
        console.log('S3 Bucket Valid and accessible', data);
      }
    });*/
    Reporter.sendEvent('DestinationS3Action', 'init', 'core.actions');
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
          const exceptionString = `====[ Unable to read file ${name}: ${e}`;
          console.log(exceptionString);
          Reporter.sendException(exceptionString);
          reject(exceptionString);
        }
        keyName = path.basename(keyName);
      }
      const s3Params = {
        Body: writePayload,
        Key: `${this.keyFolderPrefix}${keyName}`,
        Bucket: this.config.s3.bucket,
      };
      this.uploadToS3(s3Params, (s3Err, s3Data) => {
        if (s3Err) {
          this.setError(s3Err);
          const uploadException = `Could not upload file to s3: ${s3Params.Key}`;
          console.log(uploadException, s3Err.stack);
          Reporter.sendException(uploadException);
          reject(s3Err);
        } else {
          console.log('File Uploaded to s3: ', s3Data);
          Reporter.sendEvent('DestinationS3Action', 'upload', 'core.actions');
          resolve(keyName);
        }
      });
    });
  }

  finalize() {
    console.log('S3Destination.finalize: ', this.config);
    Reporter.sendEvent('DestinationS3Action', 'finalize', 'core.actions');
    this.setStatus('SHUTDOWN');
  }
}
