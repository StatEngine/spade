import fs from 'fs';
import sinon from 'sinon';
import chai from 'chai';
import { Spade } from '../app/spade';

const assert = chai.assert;

describe('SpadeE2E', () => {
  let destAction = null;
  let stub = null;
  let testSpade = null;
  before((done) => {
    testSpade = new Spade();
    testSpade.init('./test/configurations/test-config.json');
    destAction = testSpade.destinations.incidents;
    stub = sinon.stub(destAction, 'run').resolves(true);
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
    }, 2500);
  });

  after((done) => {
    // stub.restore();
    done();
  });
});
