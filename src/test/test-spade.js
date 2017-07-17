import fs from 'fs';
import { assert } from 'chai';
import { Spade } from '../spade';

describe('SpadeE2E', () => {
  const spade = new Spade();
  const testConfig = '../test-config.json';
  spade.init(testConfig);

  it('Should load the configuration object', () => {
    // Load the test configuration object
    assert.notEqual(spade.config, null);
    assert.Equal(spade.config.departmentId, '12345');
  });

  it('Should create destination actions from configuration', () => {
    const createdDestinationKeys = Object.keys(this.destinations);
    assert.isAbove(createdDestinationKeys.length, 0);
  });

  it('Should create source actions from configuration', () => {
    const createdSourceKeys = Object.keys(this.sources);
    assert.isAbove(createdSourceKeys.length, 0);
  });

  it('Should report metrics using telemetry', () => {
    // Come back to this test once you understand telemetry more.
  });
  it('Should run actions and push results to destinations', () => {
    // Assuming actions were created properly move a  testJson file into watch
    fs.createReadStream('testJson.json').pipe(fs.createWriteStream('./testFolder/testJson.json'));

    const fileMoved = fs.existsSync('./testFolder/testJson.json');
    const newLocation = fs.existsSync('./testFolder/processed/testJson.json');

    assert.Equal(fileMoved, false);
    assert.Equal(newLocation, true);
  });

  it('Should properly stop and shutdown all actions');
});
