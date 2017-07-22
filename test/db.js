import sql from 'mssql';
import Promise from 'bluebird';
import { assert } from 'chai';
import incident from './data/masterIncidents.json';
import vehicles from './data/vehicles.json';
import { avl, vehicle, masterIncident, responseVehiclesAssigned } from './data/models.js';

function getColumnByName(table, name) {
  return table.columns.filter(column => column.name === name)[0];
}

describe('MSSQL Database', () => {
  let dbPool = null;
  const tables = [
    avl,
    masterIncident,
    vehicle,
    responseVehiclesAssigned,
  ];

  function queryDB(query) {
    return dbPool.request().query(query);
  }

  function dropTables() {
    return Promise.map(tables, (table) => {
      const tableName = `dbo.${table.getName()}`;
      return queryDB(`IF OBJECT_ID('${tableName}', 'U') IS NOT NULL DROP TABLE ${tableName}`);
    });
  }

  function tableExists(table) {
    return queryDB(`SELECT count(*) as count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = \'${table}\'`)
    .then(res => res.recordset[0].count >= 1);
  }

  function addIncidents() {
    return Promise.map(incident.features, (feature) => {
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

      return queryDB(masterIncident.insert(obj).toString());
    });
  }

  function addVehicles() {
    return Promise.map(vehicles.features.slice(0, 50), (feature) => {
      const obj = {};
      Object.keys(feature.attributes).forEach((key) => {
        let value = feature.attributes[key];

        if (key === 'Latitude') {
          key = 'Current_Lat';
        }

        if (key === 'Longitude') {
          key = 'Current_Lon';
        }

        const column = getColumnByName(vehicle, key);

        if (!column) {
          return;
        }

        if (column.name === 'AVL_ID' && value === null) {
          value = '123'
        }

        if (value === null) {
          obj[key] = value;
          return;
        }

        if (column.dataType === 'datetime') {
          obj[key] = new Date(value);
          return;
        }

        // Clark County stores coords as ints for the vehicle table.
        // This is just to get test data loaded.
        if (column.name === 'Current_Lat' || column.name === 'Current_Lon') {
          obj[key] = parseInt(value, 10);
          return;
        }

        obj[key] = value;
      });

      return queryDB(vehicle.insert(obj).toString());
    });
  }

  before(() => {
      return sql.connect(process.env.MSSQL_TEST_DB)
      .then((pool) => { dbPool = pool; })
      .then(dropTables)
      .then(() => {
        return Promise.map(tables, (table) => {
          return queryDB(`${table.create().toString()}`);
        })
      });
    });

  it('should create all tables', () => {
    return Promise.map(tables, table => {
      return tableExists(table.getName()).then(res => assert.isTrue(res))
    })
  });

  it('should be able to add incidents', () => {
    return addIncidents().then(() => {
      return queryDB(`SELECT COUNT(*) as count from ${masterIncident.getName()}`).then((res) => {
        const theCount = res.recordset[0].count;
        assert.equal(theCount, 10);
        return Promise.resolve(theCount);
      });
    });
  });

  it('should be able to add vehicles', () => {
    return addVehicles().then(() => {
      return queryDB(`SELECT COUNT(*) as count from ${vehicle.getName()}`).then((res) => {
        assert.equal(res.recordset[0].count, 50);
      })
    })
  }).timeout(15000);

  after(dropTables);
})
