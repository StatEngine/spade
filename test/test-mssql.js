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

  const queryDB = (query) => {
    return dbPool.request().query(query);
  };
  const dropTables = () => {
    return Promise.map(tables, (table) => {
      const tableName = `dbo.${table.getName()}`;
      return queryDB(`IF OBJECT_ID('${tableName}', 'U') IS NOT NULL DROP TABLE ${tableName}`);
    });
  };
  const addIncidents = () => {
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
      queryDB(masterIncident.insert(obj).toString());
    });
  };

  before((done) => {
    mssql.connect('mssql://statengine:st4t3ng1n3@mmbvrsla1et9aq.cjvlp58981av.us-east-1.rds.amazonaws.com/test')
    .then((pool) => { dbPool = pool; })
    .then(dropTables)
    .then(() => {
      return Promise.map(tables, (table) => {
        return queryDB(`${table.create().toString()}`);
      });
    })
    .then(addIncidents);
    done();
  });

  it('Should create the tables, and retrieve 3 rows', (done) => {
    const rows = [];
    console.log('Select Query: ', selectQuery.toQuery().text);
    done();
  });

  it('Should insert another row and then retrieve new row ', (done) => {
    const rows = [];
    done();
  });

  after((done) => {

  });
});
