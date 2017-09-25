import fs from 'fs';
import sinon from 'sinon';
import chai from 'chai';
import Promise from 'bluebird';
import { Spade } from '../app/spade';
import { SourceAction } from '../app/actions.js'

const assert = chai.assert;

describe('SpadeE2E', () => {
  let destAction = null;
  let stub = null;
  let stubRun = null;
  let testSpade = null;
  let testSource = null;
  before((done) => {
    testSpade = new Spade();
    testSpade.init('./test/configurations/test-config.json');
    destAction = testSpade.destinations.incidents;
    // Specifically for timeout testing.
    const sourceConfig = {
      trigger: {
        schedule: 0.8,
      },
    };
    testSource = new SourceAction(sourceConfig);
    // Stub out run function to spin for 10 seconds before exiting,
    stubRun = sinon.stub(testSource, 'run').callsFake(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1300);
      });
    });
    done();
  });

  it('Should load the configuration object', () => {
    // Load the test configuration object
    assert.notEqual(testSpade.config, null, 'Configuration object should be properly loaded by application.');
    assert.equal(testSpade.config.departmentId, '12345', 'DepartmentID should be set to valid value.');
  });

  it('Should create destination actions from configuration', () => {
    const createdDestinationKeys = Object.keys(testSpade.destinations);
    assert.isAbove(createdDestinationKeys.length, 0, 'Destination actions should have been created from test configuration');
  });

  it('Should create source actions from configuration', () => {
    const createdSourceKeys = Object.keys(testSpade.sources);
    assert.isAbove(createdSourceKeys.length, 0, 'Source actions should have been created from test configuration');
  });

  it('Should report metrics using telemetry', () => {
    // Come back to this test once you understand telemetry more.
  });

  it('Should run actions and push results to destinations', (done) => {
    // Assuming actions were created properly move a  testJson file into watch
    const fileBuffer = fs.readFileSync('./test/data/testjson.json');

    try {
      fs.writeFileSync('./test/data/testFolder/testJson.json', fileBuffer);
    } catch (e) {
      console.log('Unable to write File');
    }

    setTimeout(() => {
      assert.equal(fs.existsSync('./test/data/testFolder/testJson.json'), false);
      assert.equal(fs.existsSync('./test/data/testFolder/processed/testJson.json'), true);
      done();
    }, 1000);
  });

  it('Should handle watching a network shared drive', (done) => {
    const fileBuffer = fs.readFileSync('./test/data/testjson.json');

    try {
      fs.writeFileSync('Z:\\testJson.json', fileBuffer);
    } catch (e) {
      console.log('Unable to write File');
    }

    setTimeout(() => {
      assert.equal(fs.existsSync('Z:\\testJson.json'), false);
      assert.equal(fs.existsSync('Z:\\processed\\testJson.json'), true);
      done();
    }, 1400);
  });

  it('Should wait for first job to finish before running the next scheduled job', (done) => {
    testSource.startSchedule(true);
    setTimeout(() => {
      done();
    }, 1700);
  });

  after((done) => {
    testSource.stopSchedule(true);
    // stub.restore();
    done();
  });
});
