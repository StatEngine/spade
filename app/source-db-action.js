/* eslint no-bitwise: ["error", { "allow": ["|"] }] */
import sqlite3Lib from 'sqlite3';
import sql from 'sql';

// import mssql from 'mssql';
// import sqlite from 'sqlite';
import { SourceAction } from './actions';

sql.setDialect('sqlite');

const sqlite3 = sqlite3Lib.verbose();
const dbTypes = ['sqlite', 'mssql'];

export default class SourceSqliteAction extends SourceAction {
  constructor(config, destination) {
    super(config, destination);
    this.dbs = {};
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
    // Ultimately thinking of splitting individual db services to separate files
    for (let i = 0; i < dbTypes.length; i += 1) {
      const dbType = dbTypes[i];
      const dbConfig = this.config[dbType];
      if (dbConfig != null) {
        if (dbType === 'sqlite') {
          const defaultDBMode = sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE;
          this.dbs.sqlite.db = new sqlite3.Database(this.config.sqlite.database, defaultDBMode, (err) => {
            if (err) {
              this.setError(err);
            }
          });

          this.dbs.sqlite.tables = [];
          for (let iTable = 0; iTable < this.config.sqlite.tables.length; iTable += 1) {
            const tableConfig = this.config.sqlite.tables[iTable];
            const tableSelect = sql.select(sql.star()).from(tableConfig.name).order(tableConfig.sortKey);
            console.log('Table select: ', tableSelect.toString());
            tableConfig.selectQuery = tableSelect;
            this.dbs.sqlite.tables.push(tableConfig);
          }
        } else if (dbType === 'mssql') {
          // TODO: Add mssql logic.
        }
      }
    }

    // schedule the job so that run()  is called regularly
    this.startSchedule();
  }

  run() {
    console.log('----[ SourceSqliteAction.run start');
    this.db.serialize(() => {
      const promises = [];
      const dbKeys = Object.keys(this.dbs);
      for (let iDB = 0; iDB < dbKeys.length; iDB += 1) {
        const dbType = dbKeys[iDB];
        const dbConfig = this.dbs[dbType];
        for (let iTable = 0; iTable < dbConfig.tables.length; iTable += 1) {
          const table = dbConfig.tables[iTable];
          dbConfig.db.each(table.selectQuery.toString(), (err, row) => {
            // TODO: makes calls to multiple tables, perform merge, then have an array of incidents
            if (err) {
              this.setError(err);
              console.log('Unable to select all from incidents table', err);
            } else {
              promises.push(this.destination.run(row[table.sortKey], row));
              console.log(row);
            }
          });
        }
    }

      Promise.all(promises).then((values) => {
        // TODO: if all the returned values are a success, consider this a success
        console.log('----[ SourceSqliteAction all records sent: ', values);
      }, (e) => {
        console.log('Unable to send one or more records from DB', e);
        this.setError(e);
      });
    });
  }

  finalize() {
    console.log('SourceSqliteAction.finalize: ', this.config);
    this.db.close();
  }
}
