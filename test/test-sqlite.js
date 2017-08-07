/* eslint no-bitwise: ["error", { "allow": ["|"] }] */
import sinon from 'sinon';
import chai from 'chai';
import sqlite3Lib from 'sqlite3';
import incident from './data/sqlite/masterIncidents.json';
import { masterIncident } from './data/sqlite/models.js';
import { Spade } from '../app/spade';


const assert = chai.assert;

function getColumnByName(table, name) {
  return table.columns.filter(column => column.name === name)[0];
}

const sqlite3 = sqlite3Lib.verbose();

describe('SQLite Database', () => {
  let testSpade = null;
  let destAction = null;
  let stub = null;
  const db = new sqlite3.Database('test-db');
  destAction = testSpade.destinations.incidents;
  stub = sinon.stub(destAction, 'run').resolves(true);
  const tables = [
    masterIncident,
  ];

  before((done) => {
    testSpade = new Spade();
    testSpade.init('./test/configurations/test-config.json');
    db.serialize(() => {
      for (let i = 0; i < tables.length; i += 1) {
        db.run(`${tables[i].create().toString()}`);
      }
      Object.values(incident.features).forEach((feature) => {
        const obj = {};
        Object.keys(feature.attributes).forEach((key) => {
          const value = feature.attributes[key];
          const column = getColumnByName(masterIncident, key);
          if (value === null) {
            obj[key] = value;
            return;
          }

          if (column.dataType === 'datetime') {
            obj[key] = new Date(value);
            return;
          }

          // Clark County stores coords as strings.  This is just to get test data loaded.
          if (column.name === 'Latitude' || column.name === 'Longitude') {
            obj[key] = value.toString().substring(0, 10);
            return;
          }

          obj[key] = value;
        });
        console.log('Insert String: ', masterIncident.insert(obj).toString());
        db.run(masterIncident.insert(obj).toString());
      });
    });
    done();
  });

  it('Should create the tables, and retrieve 3 rows', (done) => {
    const selectQuery = masterIncident.select().toString();
    const rows = [];
    console.log('Select Query: ', selectQuery);
    db.serialize(() => {
      db.each('SELECT * FROM Response_Master_Incident', [], (err, row) => {
        if (err) {
          console.log(err);
        } else {
          rows.append(row);
          console.log('Database returned: ', row);
        }
      });
    });
    assert.equal(rows.length, 3, 'Should retrieve the initial 3 rows added to database.')
    done();
  });

  it('Action should grab first 3 rows from db and send to destination', (done) => {
    const action = testSpade.sources.cadDb;
    assert.equal(action.lastIncidentNumber, '17-0023763', 'Should be set to highest incident number');
    done();
  });


  after((done) => {
    /* db.close((err) => {
      if (err) {
        console.log('Unable to close test Database');
      } */
    stub.restore();
    done();
  });
})
