import fs from 'fs';
import sinon from 'sinon';
import chai from 'chai';
import { Spade } from '../src/spade';

const assert = chai.assert;

describe('SpadeE2E', () => {
  let destAction = null;
  let stub = null;
  let testSpade = null;
  before((done) => {
    testSpade = new Spade();
    testSpade.init('./test/test-config.json');
    destAction = testSpade.destinations.incidents;
    stub = sinon.stub(destAction, 'run').resolves(true);
    done();
  })

  it('Should load the configuration object', () => {
    // Load the test configuration object
    assert.notEqual(testSpade.config, null);
    assert.equal(testSpade.config.departmentId, '12345');
  });

  it('Should create destination actions from configuration', () => {
    const createdDestinationKeys = Object.keys(testSpade.destinations);
    assert.isAbove(createdDestinationKeys.length, 0);
  });

  it('Should create source actions from configuration', () => {
    const createdSourceKeys = Object.keys(testSpade.sources);
    assert.isAbove(createdSourceKeys.length, 0);
  });

  it('Should report metrics using telemetry', () => {
    // Come back to this test once you understand telemetry more.
  });

  it('Should run actions and push results to destinations', (done) => {
    // Assuming actions were created properly move a  testJson file into watch
    const fileBuffer = fs.readFileSync('./test/testjson.json');

    try {
      fs.writeFileSync('./test/testFolder/testJson.json', fileBuffer);
    } catch (e) {
      console.log('Unable to write File');
    }

    setTimeout(() => {
      assert.equal(fs.existsSync('./test/testFolder/testJson.json'), false);
      assert.equal(fs.existsSync('./test/testFolder/processed/testJson.json'), true);
      done();
    }, 1000);
  });

  after((done) => {
    stub.restore();
    done();
  });
});
