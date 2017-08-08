/* eslint no-bitwise: ["error", { "allow": ["|"] }] */
import sinon from 'sinon';
import chai from 'chai';
import sql from 'sql';
import mssql from 'mssql';
import Promise from 'bluebird';
import incident from './data/mssql/testIncidents.json';
import { masterIncident } from './data/mssql/testModels.js';
import { Spade } from '../app/spade';

mssql.Promise = Promise;
sql.setDialect('mssql');
const assert = chai.assert;

function getColumnByName(table, name) {
  return table.columns.filter(column => column.name === name)[0];
}

describe('MSSql Database', () => {
  let dbPool = null;
  const tables = [
    masterIncident,
  ];
  let lastIncidentNumber = 0;
  const obj = {
    ID: 0,
    Master_Incident_Number: 'blah',
    Response_Date: 0,
  };
  const selectQuery = masterIncident.select().where(masterIncident.ID.gt(lastIncidentNumber)).order(masterIncident.ID.descending);
  const insertQuery = masterIncident.insert(obj);
  console.log(insertQuery);

  const queryDB = (query, parameters = null) => {
    const requestQ = dbPool.request();
    if (parameters !== null) {
      for (let iParam = 0; iParam < parameters.length; iParam += 1) {
        const paramName = iParam + 1;
        requestQ.input(paramName, parameters[iParam]);
      }
    }
    return requestQ.query(query);
  };
  const dropTables = () => {
    return Promise.map(tables, (table) => {
      const tableName = `dbo.${table.getName()}`;
      return queryDB(`IF OBJECT_ID('${tableName}', 'U') IS NOT NULL DROP TABLE ${tableName}`);
    });
  };
  const addIncidents = () => {
    const promises = [];
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
      promises.push(queryDB(masterIncident.insert(obj).toString()));
    });
    return Promise.all(promises);
  };

  before((done) => {
    mssql.connect(process.env.MSSQL_TEST_DB)
    .then((pool, err) => {
      if (pool) {
        console.log(pool);
        dbPool = pool;
      } else {
        console.log(err);
      }
    })
    .then(dropTables)
    .then(() => {
      return Promise.map(tables, (table) => {
        return queryDB(`${table.create().toString()}`);
      });
    })
    .then(addIncidents)
    .then(() => { done(); });
  });

  it('Should create the tables, and retrieve 3 rows', (done) => {
    const selectQ = selectQuery.toQuery();
    selectQ.values[0] = lastIncidentNumber;
    queryDB(selectQ.text, selectQ.values).then((result) => {
      console.log(result);
      assert.equal(result.recordset.length, 3, 'Should retrieve initial 3 rows');
      lastIncidentNumber = result.recordset[0].ID;
      done();
    });
  });

  it('Should insert another row and then retrieve new row ', (done) => {
    const insertQ = insertQuery.toQuery();
    insertQ.values = [1755509, '18-00098', 2345];
    console.log(insertQ.text, insertQ.values);
    queryDB(insertQ.text, insertQ.values).then((result) => {
      console.log('Insert Result: ', result);
      const selectQ = selectQuery.toQuery();
      selectQ.values[0] = lastIncidentNumber;
      return queryDB(selectQ.text, selectQ.values);
    }).then((result) => {
      console.log('Select new Result: ', result);
      assert.equal(result.recordset.length, 1, 'Should retrieve 1 added row');
      lastIncidentNumber = result.recordset[0].ID;
      done();
    });
  });

  after((done) => {
    dropTables().then(() => {
      if (dbPool) {
        dbPool.close();
      }
      done();
    });
  });
});
