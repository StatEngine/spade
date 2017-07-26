import sqlite3Lib from 'sqlite3';
// import sql from 'sql';
// import mssql from 'mssql';
// import sqlite from 'sqlite';
import { SourceAction } from './actions';

const sqlite3 = sqlite3Lib.verbose();

export default class SourceSqliteAction extends SourceAction {
  constructor(config, destination) {
    super(config, destination);
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
    try {
      this.db = new sqlite3.Database(':memory:');
      this.db.serialize(() => {
        this.db.run('CREATE TABLE incidents (id INTEGER NOT NULL UNIQUE, location TEXT NOT NULL, date_time TEXT NOT NULL, PRIMARY KEY(id))');

        const statement = this.db.prepare('INSERT INTO incidents (id, location, date_time) VALUES (?, ?, ?)');
        statement.run(10, '-40.1, 20.2', '1/2/10 2:12 am');
        statement.run(11, '-41.2, 21.3', '1/3/10 3:12 am');
        statement.run(12, '-42.3, 22.4', '1/4/10 4:12 am');
        statement.finalize();
      });
    } catch (e) {
      console.log('Unable to create database im memory', e.stack);
      this.setError(e);
    }

    // schedule the job so that run()  is called regularly
    this.startSchedule();
  }

  run() {
    console.log('----[ SourceSqliteAction.run start');
    this.db.serialize(() => {
      const promises = [];
      this.db.each('SELECT * FROM incidents', (err, row) => {
        // TODO: makes calls to multiple tables, perform merge, then have an array of incidents
        if (err) {
          this.setError(err);
          console.log('Unable to select all from incidents table', err);
        } else {
          promises.push(this.destination.run(row));
          console.log(row);
        }
      });
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
