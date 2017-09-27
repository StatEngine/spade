/* eslint no-bitwise: ["error", { "allow": ["|"] }] */
import sqlite3Lib from 'sqlite3';
import sql from 'sql';

// import mssql from 'mssql';
// import sqlite from 'sqlite';
import Promise from 'bluebird';
import { SourceAction } from './actions';

sql.setDialect('sqlite');

const sqlite3 = sqlite3Lib.verbose();

export default class SourceSqliteAction extends SourceAction {
  constructor(config, destination) {
    super(config, destination);
    this.lastIncidentNumber = null;
    console.log('SourceSqliteAction.constructor: ', this.config);
  }

  init() {
    // used to generate sql strings as opposed to directly typing strings
    // to more safely handle descrepancies between sqlite, mssql, mysql, and pg.
    // note that even for basic selects statements, some dialacts use quotes,
    // some bracket, others slanted single quotes etc.
    // sql.setDialect('sqlite');

    // TODO: create connection object and connect to db testing creds & params
    // for now, create an sqlight db, populated with a few row
    const defaultDBMode = sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE;
    this.db = new sqlite3.Database(this.config.sqlite.database, defaultDBMode, (err) => {
      if (err) {
        this.setError(err);
      }
    });
    this.tables = [];
    for (let iTable = 0; iTable < this.config.sqlite.tables.length; iTable += 1) {
      const tableConfig = this.config.sqlite.tables[iTable];
      const tableSelect = sql.select().from(tableConfig.name).order(tableConfig.sortKey);
      console.log('Table select: ', tableSelect.toString());
      tableConfig.selectQuery = tableSelect;
      this.tables.push(tableConfig);
    }
    // schedule the job so that run()  is called regularly
    this.startSchedule();
  }

  run() {
    console.log('----[ SourceSqliteAction.run start');
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        const promises = [];
        for (let iTable = 0; iTable < this.tables.length; iTable += 1) {
          const table = this.tables[iTable];
          this.db.each(table.selectQuery.toString(), (err, row) => {
            // TODO: makes calls to multiple tables, perform merge, then have an array of incidents
            if (err) {
              this.setError(err);
              console.log('Unable to select all from incidents table', err);
              reject(err);
            } else {
              promises.push(this.destination.run(row[table.sortKey], row));
              console.log(row);
            }
          });
        }

        Promise.all(promises).then((values) => {
          // TODO: if all the returned values are a success, consider this a success
          let highestIncidentNum = null;
          for (let i = 0; i < values.length; i += 1) {
            const incidentIdentifier = values[i];
            if (highestIncidentNum === null || highestIncidentNum > incidentIdentifier) {
              highestIncidentNum = incidentIdentifier;
            }
          }
          this.lastIncidentNumber = highestIncidentNum;
          console.log('----[ SourceSqliteAction all records sent: ', values);
          resolve(values);
        }, (e) => {
          console.log('Unable to send one or more records from DB', e);
          this.setError(e);
          reject(e);
        });
      });
    });
  }

  finalize() {
    console.log('SourceSqliteAction.finalize: ', this.config);
    this.db.close();
  }
}
