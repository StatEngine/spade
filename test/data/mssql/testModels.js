import sql from 'sql';

sql.setDialect('mssql');

export const masterIncident = sql.define({
  name: 'Response_Master_Incident',
  columns: [
    {
      name: 'ID',
      dataType: 'int',
      notNull: true,
    },
    {
      name: 'Master_Incident_Number',
      dataType: 'varchar(20)',
      notNull: false,
    },
    {
      name: 'Response_Date',
      dataType: 'datetime',
      notNull: false,
    },
  ],
});

export const vehicle = sql.define({
  name: 'Vehicle',
  columns: [
    {
      name: 'ID',
      dataType: 'int',
      notNull: true,
    },
    {
      name: 'Name',
      dataType: 'varchar(10)',
      notNull: true,
    },
  ],
});
