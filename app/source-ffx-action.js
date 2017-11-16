import sql from 'mssql';
import _ from 'lodash';
import Promise from 'bluebird';
import { SourceAction } from './actions';

sql.Promise = require('bluebird');

let pool = null;

export default class SourceFfxAction extends SourceAction {
  constructor(config, destination) {
    super(config, destination);
    console.log('SourceFfxAction.constructor: ', this.config);
  }

  init() {
    this.startSchedule();
  }

  static query(query, key, inputs = []) {
    const request = pool.request();

    inputs.forEach((args) => {
      request.input(...args);
    });

    return request.query(query)
    .then((results) => {
      const res = {};
      res[key] = (results.rowsAffected[0] === 1) ? results.recordset[0] : results.recordsets[0];
      return res;
    });
  }

  static getEvent(id) {
    return SourceFfxAction.query(`
      SELECT TOP 1
      dbo.agency_event.num_1 AS event_num,
      dbo.agency_event.eid AS event_id,
      dbo.agency_event.dgroup AS disp_group,
      dbo.common_event.clname AS caller_name,
      dbo.common_event.cstr_add AS caller_str_addr,
      dbo.common_event.estnum AS event_str_num,
      dbo.common_event.edirpre AS event_str_prefix,
      dbo.common_event.efeanme AS event_str_name,
      dbo.common_event.efeatyp AS event_str_type,
      dbo.common_event.edirsuf AS event_str_suffix,
      dbo.common_event.eapt AS event_apt,
      dbo.common_event.earea AS event_area,
      dbo.common_event.emun AS event_city,
      dbo.common_event.zip,
      dbo.common_event.ecompl AS event_com_place,
      dbo.common_event.xstreet1,
      dbo.common_event.xstreet2,
      dbo.common_event.x_cord,
      dbo.common_event.y_cord,
      dbo.common_event.fire_esz,
      dbo.agency_event.esz AS fire_box,
      dbo.common_event.adc_mapgrid,
      dbo.common_event.tax_mapgrid,
      dbo.common_event.patient,
      dbo.agency_event.priority,
      dbo.agency_event.alarm_lev,
      dbo.agency_event.lev3 AS first_due,
      dbo.agency_event.lev4 AS incident_battalion,
      dbo.agency_event.assigned_units,
      CAST(SUBSTRING(dbo.agency_event.sdts, 1, 4) + '-' + SUBSTRING(dbo.agency_event.sdts, 5, 2) + '-' + SUBSTRING(dbo.agency_event.sdts, 7, 2) + ' ' + SUBSTRING(dbo.agency_event.sdts, 9, 2) + ':' + SUBSTRING(dbo.agency_event.sdts, 11, 2) + ':' + SUBSTRING(dbo.agency_event.sdts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS call_receive_ts,
      CAST(SUBSTRING(dbo.agency_event.ad_ts, 1, 4) + '-' + SUBSTRING(dbo.agency_event.ad_ts, 5, 2) + '-' + SUBSTRING(dbo.agency_event.ad_ts, 7, 2) + ' ' + SUBSTRING(dbo.agency_event.ad_ts, 9, 2) + ':' + SUBSTRING(dbo.agency_event.ad_ts, 11, 2) + ':' + SUBSTRING(dbo.agency_event.ad_ts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS alarm_time_ts,
      CAST(SUBSTRING(dbo.agency_event.ds_ts, 1, 4) + '-' + sUBSTRING(dbo.agency_event.ds_ts, 5, 2) + '-' + SUBSTRING(dbo.agency_event.ds_ts, 7, 2) + ' ' + SUBSTRING(dbo.agency_event.ds_ts, 9, 2) + ':' + SUBSTRING(dbo.agency_event.ds_ts, 11, 2) + ':' + SUBSTRING(dbo.agency_event.ds_ts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS first_disp_ts,
      CAST(SUBSTRING(dbo.agency_event.en_ts, 1, 4) + '-' + SUBSTRING(dbo.agency_event.en_ts, 5, 2) + '-' + SUBSTRING(dbo.agency_event.en_ts, 7, 2) + ' ' + SUBSTRING(dbo.agency_event.en_ts, 9, 2) + ':' + SUBSTRING(dbo.agency_event.en_ts, 11, 2) + ':' + SUBSTRING(dbo.agency_event.en_ts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS first_enr_ts,
      CAST(SUBSTRING(dbo.agency_event.ar_ts, 1, 4) + '-' + SUBSTRING(dbo.agency_event.ar_ts, 5, 2) + '-' + SUBSTRING(dbo.agency_event.ar_ts, 7, 2) + ' ' + SUBSTRING(dbo.agency_event.ar_ts, 9, 2) + ':' + SUBSTRING(dbo.agency_event.ar_ts, 11, 2) + ':' + SUBSTRING(dbo.agency_event.ar_ts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS first_arrive_ts,
      CAST(SUBSTRING(dbo.agency_event.tr_ts, 1, 4) + '-' + SUBSTRING(dbo.agency_event.tr_ts, 5, 2) + '-' + SUBSTRING(dbo.agency_event.tr_ts, 7, 2) + ' ' + SUBSTRING(dbo.agency_event.tr_ts, 9, 2) + ':' + SUBSTRING(dbo.agency_event.tr_ts, 11, 2) + ':' + SUBSTRING(dbo.agency_event.tr_ts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS first_transport_ts,
      CAST(SUBSTRING(dbo.agency_event.ta_ts, 1, 4) + '-' + SUBSTRING(dbo.agency_event.ta_ts, 5, 2) + '-' + SUBSTRING(dbo.agency_event.ta_ts, 7, 2) + ' ' + SUBSTRING(dbo.agency_event.ta_ts, 9, 2) + ':' + SUBSTRING(dbo.agency_event.ta_ts, 11, 2) + ':' + SUBSTRING(dbo.agency_event.ta_ts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS first_trans_ar_ts,
      CAST(SUBSTRING(dbo.agency_event.xdts, 1, 4) + '-' + sUBSTRING(dbo.agency_event.xdts, 5, 2) + '-' + SUBSTRING(dbo.agency_event.xdts, 7, 2) + ' ' + SUBSTRING(dbo.agency_event.xdts, 9, 2) + ':' + SUBSTRING(dbo.agency_event.xdts, 11, 2) + ':' + SUBSTRING(dbo.agency_event.xdts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS last_unit_close_ts,
      CAST(SUBSTRING(dbo.agency_event.cdts, 1, 4) + '-' + sUBSTRING(dbo.agency_event.cdts, 5, 2) + '-' + SUBSTRING(dbo.agency_event.cdts, 7, 2) + ' ' + SUBSTRING(dbo.agency_event.cdts, 9, 2) + ':' + SUBSTRING(dbo.agency_event.cdts, 11, 2) + ':' + SUBSTRING(dbo.agency_event.cdts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS event_opened,
      dbo.agency_event.xcmt AS closing_cmt,
      dbo.agency_event.tycod AS event_type,
      dbo.agency_event.typ_eng AS event_type_descr,
      dbo.FFX_ICAD_Types.Event_Code AS event_type_code,
      dbo.FFX_ICAD_Types.EMS_Type,
      dbo.FFX_ICAD_Types.Reportable,
      dbo.FFX_ICAD_Types.SpecialOperations,
      dbo.agency_event.is_open,
      dbo.agency_event.open_and_curent
      FROM  dbo.agency_event
      INNER JOIN dbo.common_event ON dbo.agency_event.eid = dbo.common_event.eid
      LEFT JOIN dbo.FFX_ICAD_Types ON dbo.agency_event.tycod = dbo.FFX_ICAD_Types.Evt_Typ
      WHERE dbo.agency_event.eid=@eid
      ORDER BY dbo.agency_event.cdts
      `, 'event', [['eid', sql.Int, id]]);
  }

  static getTimes(id) {
    return SourceFfxAction.query(`SELECT
      CAST(SUBSTRING(cdts, 1, 4) + '-' + SUBSTRING(cdts, 5, 2) + '-' + SUBSTRING(cdts, 7, 2) + ' ' + SUBSTRING(cdts, 9, 2) + ':' + SUBSTRING(cdts, 11, 2) + ':' + SUBSTRING(cdts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS creation_date,
      cpers,
      cterm,
      curent,
      eid,
      info_scope,
      remarks,
      rev_num,
      row_num,
      set_name,
      state_desc,
      state_dts,
      state_sec,
      timer_value,
      CAST(SUBSTRING(udts, 1, 4) + '-' + SUBSTRING(udts, 5, 2) + '-' + SUBSTRING(udts, 7, 2) + ' ' + SUBSTRING(udts, 9, 2) + ':' + SUBSTRING(udts, 11, 2) + ':' + SUBSTRING(udts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS update_date,
      updt_flag,
      upers,
      user_gen,
      uterm
      from incident_tracking
      where eid=@id`, 'incident_tracking', [['id', sql.Int, id]]);
  }


  static getPersonnel(table, id) {
    return SourceFfxAction.query(`SELECT
      id,
      CAST(SUBSTRING(cdts, 1, 4) + '-' + SUBSTRING(cdts, 5, 2) + '-' + SUBSTRING(cdts, 7, 2) + ' ' + SUBSTRING(cdts, 9, 2) + ':' + SUBSTRING(cdts, 11, 2) + ':' + SUBSTRING(cdts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS creation_date,
      empid,
      primary_empid,
      CAST(SUBSTRING(recovery_cdts, 1, 4) + '-' + SUBSTRING(recovery_cdts, 5, 2) + '-' + SUBSTRING(recovery_cdts, 7, 2) + ' ' + SUBSTRING(cdts, 9, 2) + ':' + SUBSTRING(recovery_cdts, 11, 2) + ':' + SUBSTRING(recovery_cdts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS backdated_creation_date,
      convert(varchar(25), un_hi_rec_id, 1) AS un_hi_rec_id,
      ht_radio
      FROM un_hi_persl
      WHERE un_hi_rec_id IN (SELECT unique_id FROM un_hi WHERE eid=@id)`,
      table, [['id', sql.Int, id]]);
  }

  static getApparatus(id) {
    return SourceFfxAction.query(`SELECT
      act_check,
      ag_id,
      carid,
      CAST(SUBSTRING(cdts, 1, 4) + '-' + SUBSTRING(cdts, 5, 2) + '-' + SUBSTRING(cdts, 7, 2) + ' ' + SUBSTRING(cdts, 9, 2) + ':' + SUBSTRING(cdts, 11, 2) + ':' + SUBSTRING(cdts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS creation_date,
      cpers,
      crew_id,
      csec,
      cterm,
      dgroup,
      disp_num,
      eid,
      lastxor,
      lastyor,
      location,
      mdtid,
      mileage,
      num_1,
      CAST(SUBSTRING(recovery_cdts, 1, 4) + '-' + SUBSTRING(recovery_cdts, 5, 2) + '-' + SUBSTRING(recovery_cdts, 7, 2) + ' ' + SUBSTRING(cdts, 9, 2) + ':' + SUBSTRING(recovery_cdts, 11, 2) + ':' + SUBSTRING(recovery_cdts, 13, 2) AS datetime) AT TIME ZONE 'Eastern Standard Time' AS backdated_creation_date,
      sub_tycod,
      tycod,
      uhiscm,
      unid,
      convert(varchar(25), unique_id, 1) AS unique_id,
      unit_status,
      sunpro_flag,
      radio_alias,
      ips_eventcategory,
      disp_alarm_lev,
      mdthostname,
      oag_id,
      odgroup,
      page_id,
      dbo.un_hi.station,
      unityp,
      dbo.FFX_ICAD_Units.Battalion AS unit_battalion,
      dbo.FFX_ICAD_Units.Station AS unit_station,
      dbo.FFX_ICAD_Units.Unit_Type AS unit_type,
      dbo.FFX_ICAD_Units.Description AS unit_description,
      dbo.FFX_ICAD_Units.Agency AS unit_agency,
      dbo.FFX_ICAD_Units.Category AS unit_category,
      dbo.FFX_ICAD_Units.ExpcStaff AS unit_expected_staffing
      FROM un_hi
      LEFT JOIN dbo.FFX_ICAD_Units ON dbo.un_hi.unid = dbo.FFX_ICAD_Units.Unit_Id
      WHERE eid=@id`,
      'un_hi', [['id', sql.Int, id]]);
  }

  static processIncident(id) {
    const p1 = SourceFfxAction.getEvent(id);
    const p2 = SourceFfxAction.getApparatus(id);
    const p3 = SourceFfxAction.getPersonnel('un_hi_persl', id);
    const p4 = SourceFfxAction.getTimes(id);

    console.time('p1');
    p1.then(() => {
      console.timeEnd('p1');
    });

    console.time('p2');
    p2.then(() => {
      console.timeEnd('p2');
    });

    console.time('p3');
    p3.then(() => {
      console.timeEnd('p3');
    });

    console.time('p4');
    p4.then(() => {
      console.timeEnd('p4');
    });

    return Promise.all([
      p1,
      p2,
      p3,
      p4,
    ]);
  }

  static findNewIncidents() {
    // TODO: improve query
    return pool.request().query(`SELECT agency_event.eid
      FROM agency_event
      WHERE agency_event.eid IN (select agency_event.eid from agency_event inner join common_event on agency_event.eid=common_event.eid)
      AND substring(agency_event.cdts, 0, 09)='20170101' AND agency_event.eid NOT IN (SELECT spade_log.event_id FROM spade_log);`);
  }

  static logIncident(eventId, closed) {
    const query = `IF NOT EXISTS(SELECT * FROM spade_log where event_id=@event_id)
      INSERT INTO dbo.spade_log(event_id, closed)
      VALUES (@event_id, @closed)
    ELSE
      UPDATE dbo.spade_log
      SET closed=@closed,updated_at=CURRENT_TIMESTAMP
      WHERE event_id=@event_id`;

    const request = pool.request();
    request.input('event_id', sql.Int, eventId);
    request.input('closed', sql.Bit, closed);
    return request.query(query);
  }

  static createLogTable() {
    const query = `
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='spade_log' AND xtype='U')
    CREATE TABLE spade_log (
        event_id int not null,
        updated_at datetime default CURRENT_TIMESTAMP,
        closed bit default 0
    )`;
    return pool.request().query(query);
  }

  static testSingleEvent(self) {
    const eid = 8162192;
    console.time('processIncident');
    return SourceFfxAction.processIncident(eid).then((res) => {
      console.timeEnd('processIncident');
      const merged = _.assign(...res);
      if (!merged.event.event_num) {
        console.log(`Event has no event_number: ${eid} -> res: ${JSON.stringify(res, undefined, 2)}`);
        return SourceFfxAction.logIncident(merged.event.event_id, merged.event.is_open === 'F' ? 1 : 0);
      }
      console.time('self.destination.run');
      return self.destination.run(`${merged.event.event_num}.json`, merged)
        .then(() => {
          console.timeEnd('self.destination.run');
          return SourceFfxAction.logIncident(merged.event.event_id, merged.event.is_open === 'F' ? 1 : 0);
        });
    });
  }

  static processNewEvents(self) {
    return SourceFfxAction.createLogTable().then(SourceFfxAction.findNewIncidents)
    .then((ids) => {
      if (ids.recordsets[0] && ids.recordsets[0].length > 0) {
        return Promise.map(ids.recordsets[0], (id) => {
          console.log(`Processing: ${id.eid};`);
          console.time(`event-TOTAL-${id.eid}`);
          return SourceFfxAction.processIncident(id.eid)
          .then((res) => {
            const merged = _.assign(...res);
            if (!merged.event.event_num) {
              console.log(`Event has no event_number: ${id.eid} -> res: ${JSON.stringify(res, undefined, 2)}`);
              const p = SourceFfxAction.logIncident(merged.event.event_id, merged.event.is_open === 'F' ? 1 : 0);
              p.then(() => {
                console.timeEnd(`event-TOTAL-${id.eid}`);
              });
              return p;
            }
            return self.destination.run(`${merged.event.event_num}.json`, merged)
              .then(() => {
                const p = SourceFfxAction.logIncident(merged.event.event_id, merged.event.is_open === 'F' ? 1 : 0);
                p.then(() => {
                  console.timeEnd(`event-TOTAL-${id.eid}`);
                });
                return p;
              });
          })
          .catch((e) => {
            console.log(`====[ Error processing: ${id.eid}, ${e.message}., ${e.stack}`);
          });
        }, { concurrency: 1 });
      }
      // if there is no more results just resolve
      return Promise.resolve();
    });
  }

  run() {
    const func = SourceFfxAction.processNewEvents;
    const self = this;

    if (!pool) {
      return new Promise((resolve, reject) => {
        sql.connect(this.config.ffx).then((p) => {
          pool = p;
          resolve();
          return func(self);
        })
        .catch((e) => {
          console.log('====[ SourceFfxAction.run catch. Will try again next scheduled cycle: ', e);
          sql.close();
          reject(e);
        })
        .error((e) => {
          console.log('====[ SourceFfxAction.run error. Will try again next scheduled cycle: ', e);
          sql.close();
          reject(e);
        });
      });
    }

    return func(self);
  }

  finalize() {
    console.log('SourceFfxAction.finalize: ', this.config);
    pool.close();
  }
}
