/* eslint no-bitwise: ["error", { "allow": ["|"] }] */
import fs from 'fs';
import sinon from 'sinon';
import chai from 'chai';
import sqlite3Lib from 'sqlite3';
import sql from 'sql';

import incident from './data/sqlite/masterIncidents.json';
import { masterIncident } from './data/sqlite/models.js';
import { Spade } from '../app/spade';

sql.setDialect('sqlite');
const assert = chai.assert;

function getColumnByName(table, name) {
  return table.columns.filter(column => column.name === name)[0];
}

const sqlite3 = sqlite3Lib.verbose();

describe('SQLite Database', () => {
  let testSpade = null;
  let destAction = null;
  let stub = null;
  let lastIncidentNumber = 0;
  let obj = {
    ID: 0,
    Master_Incident_Number: 'blah',
    Response_Date: 0
  };
  const selectQuery = masterIncident.select().where(masterIncident.ID.gt(lastIncidentNumber)).order(masterIncident.ID.descending);
  const insertQuery = masterIncident.insert(obj);
  console.log(insertQuery);
  const db = new sqlite3.Database('test-db');
  const tables = [
    masterIncident,
  ];

  before((done) => {
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
    const rows = [];
    console.log('Select Query: ', selectQuery.toQuery().text);
    db.serialize(() => {
      db.each(selectQuery.toString(), [], (err, row) => {
        if (err) {
          console.log(err);
        } else {
          rows.push(row);
          console.log('Database returned: ', row);
        }
      }, (err, rowCount) => {
        assert.equal(rowCount, 3, 'Should retrieve the initial 3 rows added to database.');
        lastIncidentNumber = rows[0].ID;
        done();
      });
    });
  });

  it('Should insert another row and then retrieve new row ', (done) => {
    const rows = [];
    db.serialize(() => {
      db.run(insertQuery.toQuery().text, [1755509, '555', 234], (err) => {
        if (err) {
          console.log(err);
        }
      });

      db.each(selectQuery.toQuery().text, [lastIncidentNumber], (err, row) => {
        if (err) {
          console.log(err);
        } else {
          rows.push(row);
          console.log('Database returned: ', row);
        }
      }, (err, rowCount) => {
        assert.equal(rowCount, 1, 'Should retrieve the single added row to database.');
        lastIncidentNumber = rows[0].ID;
        done();
      });
    });
  });

  after((done) => {
    db.close((err) => {
      if (err) {
        console.log('Unable to close test Database');
      } else {
        fs.unlinkSync('./test-db');
        done();
      }
    });
  });
});
