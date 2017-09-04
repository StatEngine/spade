import sql from 'mssql';
import _ from 'lodash';
import Promise from 'bluebird';
import { SourceAction } from './actions';


export default class SourceFfxAction extends SourceAction {
  constructor(config, destination) {
    super(config, destination);
    console.log('SourceFfxAction.constructor: ', this.config);
  }

  init() {
    // TODO: create connection object and connect to db testing creds & params
    this.startSchedule();
  }

  static getRows(table, id, idColumn = 'eid') {
    let query = `SELECT * from ${table} where ${idColumn}=${id}`;

    if (table === 'agency_event') {
      query = `SELECT *, convert(datetime, substring(xdts,0,5)+'-'+substring(xdts,5,2)+'-'+substring(xdts,7,2)+'T'+substring(xdts,9,2)+':'+substring(xdts,11,2)+':'+substring(xdts,13,2), 127) AT TIME ZONE 'Eastern Standard Time' as xdts_time from ${table} where ${idColumn}=${id}`;
    }

    return new sql.Request().query(query)
    .then((results) => {
      const res = {};
      res[table] = (results.rowsAffected[0] === 1) ? results.recordset[0] : results.recordsets[0];
      return res;
    });
  }

  static getPersonnel(table, id, idColumn = 'eid') {
    return new sql.Request().query(`SELECT * from un_hi_persl where un_hi_rec_id in (select unique_id from un_hi where ${idColumn}=${id})`)
    .then((results) => {
      const res = {};
      res[table] = (results.rowsAffected[0] === 1) ? results.recordset[0] : results.recordsets[0];
      return res;
    });
  }

  static processIncident(id) {
    return Promise.all([
      SourceFfxAction.getRows('agency_event', id),
      SourceFfxAction.getRows('agency_event_history', id),
      SourceFfxAction.getRows('common_event', id),
      SourceFfxAction.getRows('common_event_history', id),
      SourceFfxAction.getRows('un_hi', id),
      SourceFfxAction.getRows('incident_tracking', id),
      SourceFfxAction.getPersonnel('un_hi_persl', id)
    ]);
  }

  static findNewIncidents(lastUpdated) {
    console.log(`----[ SourceFfxAction.findNewIncidents -> Checking incidents since: ${lastUpdated}.`)
    const request = new sql.Request();
    return request.query(`SELECT top 10 eid from agency_event where convert(datetime, substring(xdts,0,5)+'-'+substring(xdts,5,2)+'-'+substring(xdts,7,2)+'T'+substring(xdts,9,2)+':'+substring(xdts,11,2)+':'+substring(xdts,13,2), 127) AT TIME ZONE 'Eastern Standard Time' > '${lastUpdated}' or xdts is null;`)
  }

  setLastProcessed(timestamp) {
    const closedTime = (typeof timestamp === 'string') ? new Date(timestamp) : timestamp;
    console.log(`Checking last ran: ${this.lastClosed} against value: ${closedTime}`)
    if (this.lastClosed == null || this.lastClosed < closedTime) {
      console.log(`Updating last ran: ${this.lastClosed} with value: ${closedTime}`)
      this.lastClosed = closedTime;
    }
  }

  run() {
    console.log('----[ SourceFfxAction.run start');
    const self = this;
    return sql.connect(this.config.ffx)
      .then(() => {
        return SourceFfxAction.findNewIncidents('2010-04-07 20:31:00.000 -04:00');
      })
      .then((ids) => {
        console.log('ids', JSON.stringify(ids.recordsets[0]));
        return Promise.map(ids.recordsets[0], (id) => {
          return SourceFfxAction.processIncident(id.eid)
          .then((res) => {
            const merged = _.assign(...res);
            return self.destination.run(`${merged.agency_event.num_1}.json`, merged)
              .then(() => self.setLastProcessed(merged.agency_event.xdts_time));
          })
        }, { concurrency: 3 });
      })
      .then(sql.close)
  }

  finalize() {
    console.log('SourceFfxAction.finalize: ', this.config);
  }
}
