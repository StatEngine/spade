import fs from 'fs';
import { assert } from 'chai';
import { Spade } from '../src/spade';

describe('SpadeE2E', () => {
  const testSpade = new Spade();
  const testConfig = './test/test-config.json';
  testSpade.init(testConfig);

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
  it('Should run actions and push results to destinations', () => {
    // Assuming actions were created properly move a  testJson file into watch
    fs.createReadStream('./test/testJson.json').pipe(fs.createWriteStream('./test/testFolder/testJson.json'));

    const fileMoved = fs.existsSync('./testFolder/testJson.json');
    const newLocation = fs.existsSync('./testFolder/processed/testJson.json');

    assert.equal(fileMoved, false);
    assert.equal(newLocation, true);
  });

  it('Should properly stop and shutdown all actions');
});
