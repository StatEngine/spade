import sql from 'sql';

sql.setDialect('mssql');

export const avl = sql.define({
  name: 'AVL',
  columns: [{
    name: 'ID',
    dataType: 'bigint',
    notNull: true,
  },
  {
    name: 'Vehicle_ID',
    dataType: 'int',
    notNull: true,
  },
  {
    name: 'Date_Time',
    dataType: 'datetime',
    notNull: true,
  }],
});

export const vehicle = sql.define({
  name: 'Vehicle',
  columns: [{
    name: 'ID',
    dataType: 'int',
    notNull: true,
  },
  {
    name: 'Name',
    dataType: 'varchar(10)',
    notNull: true,
  },
  {
    name: 'Current_Location',
    dataType: 'varchar(80)',
    notNull: false,
  },
  {
    name: 'Current_City',
    dataType: 'varchar(35)',
    notNull: false,
  },
  {
    name: 'Destination_Location',
    dataType: 'varchar(80)',
    notNull: false,
  },
  {
    name: 'Destination_City',
    dataType: 'varchar(35)',
    notNull: false,
  },
  {
    name: 'StartShiftDate',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'EndShiftDate',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Status_ID',
    dataType: 'int',
    notNull: true,
  },
  {
    name: 'LateFlag',
    dataType: 'bit',
    notNull: true,
  },
  {
    name: 'End_Of_ShiftFlag',
    dataType: 'bit',
    notNull: true,
  },
  {
    name: 'Current_Lat',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'Current_Lon',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'Destination_Lat',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'Destination_Lon',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'IsActive',
    dataType: 'bit',
    notNull: true,
  },
  {
    name: 'Post_Station_ID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'VehicleBodyType_ID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'VehicleCert_ID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'Odometer',
    dataType: 'float',
    notNull: false,
  },
  {
    name: 'LastSvcDate',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'FailSafe_30Count',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'Failsafe_30Score',
    dataType: 'smallint',
    notNull: false,
  },
  {
    name: 'FailSafe_50Count',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'FailSafe_50Score',
    dataType: 'smallint',
    notNull: false,
  },
  {
    name: 'PagingService_ID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'Pager_ID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'AVLEnabled',
    dataType: 'bit',
    notNull: true,
  },
  {
    name: 'MDTEnabled',
    dataType: 'bit',
    notNull: true,
  },
  {
    name: 'AVL_ID',
    dataType: 'int',
    notNull: true,
  },
  {
    name: 'Auto_Odometer',
    dataType: 'bit',
    notNull: true,
  },
  {
    name: 'Scheduled_PU_Date',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'Last_Service_Date',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'PrimaryResource_ID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'VIN',
    dataType: 'varchar(30)',
    notNull: false,
  },
  {
    name: 'LicensePlateNumber',
    dataType: 'varchar(12)',
    notNull: false,
  },
  {
    name: 'PrimaryRadioChannel_ID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'Post_Station_Flag',
    dataType: 'tinyint',
    notNull: false,
  },
  {
    name: 'LicenseExpiration',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'UnitName_ID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'CurrentDivision_ID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'Elapsed_Time',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Master_Incident_ID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'HourMeter',
    dataType: 'float',
    notNull: false,
  },
  {
    name: 'OSReason_ID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'MST_MDT_ID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'FailSafe_Required',
    dataType: 'tinyint',
    notNull: false,
  },
  {
    name: 'Min_Personnel',
    dataType: 'tinyint',
    notNull: false,
  },
  {
    name: 'Saved_Status_ID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'Readiness_LateFlag',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'Last_Station_ID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'Speed',
    dataType: 'smallint',
    notNull: false,
  },
  {
    name: 'Heading',
    dataType: 'varchar(3)',
    notNull: false,
  },
  {
    name: 'Altitude',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'LastAVLUpdate',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Init_Cross_Staff_Vehicle_ID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'LateMealFlag',
    dataType: 'tinyint',
    notNull: false,
  },
  {
    name: 'BeginningOfEmployeeShiftFlag',
    dataType: 'tinyint',
    notNull: false,
  },
  {
    name: 'EndOfEmployeeShiftFlag',
    dataType: 'tinyint',
    notNull: false,
  },
  {
    name: 'PreMealFlag',
    dataType: 'tinyint',
    notNull: false,
  },
  {
    name: 'RosterScheduleID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'PersonnelCount',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'AlphaNumericPin',
    dataType: 'varchar(255)',
    notNull: false,
  },
  {
    name: 'AVLQuality',
    dataType: 'varchar(10)',
    notNull: false,
  },
  {
    name: 'AgencyTypeID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'ClearedLastCallEnroute',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'ClearedLastCallAtScene',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'HomeDivisionID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'HomeSectorID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'Beat',
    dataType: 'varchar(5)',
    notNull: false,
  },
  {
    name: 'SupervisorRadioID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'FlightTimerStatus',
    dataType: 'tinyint',
    notNull: true,
  },
  {
    name: 'CustomLateFlag',
    dataType: 'int',
    notNull: true,
  },
  {
    name: 'UserLateFlag',
    dataType: 'tinyint',
    notNull: true,
  },
  {
    name: 'OriginalPostStationID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'MoveUpTime',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'InEvaluation',
    dataType: 'bit',
    notNull: true,
  },
  {
    name: 'StackLateFlag',
    dataType: 'tinyint',
    notNull: true,
  },
  {
    name: 'QuickNote',
    dataType: 'varchar(255)',
    notNull: false,
  },
  {
    name: 'StrikeTeamID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'StrikeTeamVehicleRoleID',
    dataType: 'int',
    notNull: true,
  },
  {
    name: 'LateTypeID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'AVLConnected',
    dataType: 'bit',
    notNull: true,
  },
  {
    name: 'MDCConnected',
    dataType: 'bit',
    notNull: true,
  },
  ],
});

// console.log(js.fields)
// https://gis.adacounty.id.gov/arcgis/rest/services/EMS/Units/MapServer/2?f=json
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
    {
      name: 'Agency_Type',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Jurisdiction',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Division',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Battalion',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Station',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Response_Area',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Response_Time_Criteria',
      dataType: 'varchar(8)',
      notNull: false,
    },
    {
      name: 'Response_Plan',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Incident_Type',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Problem',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Priority_Number',
      dataType: 'int',
      notNull: false,
    },
    {
      name: 'Priority_Description',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Location_Name',
      dataType: 'varchar(400)',
      notNull: false,
    },
    {
      name: 'Address',
      dataType: 'varchar(400)',
      notNull: false,
    },
    {
      name: 'Apartment',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'City',
      dataType: 'varchar(35)',
      notNull: false,
    },
    {
      name: 'State',
      dataType: 'varchar(5)',
      notNull: false,
    },
    {
      name: 'Postal_Code',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'County',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Location_Type',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Latitude',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'Longitude',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'Map_Info',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'Cross_Street',
      dataType: 'varchar(400)',
      notNull: false,
    },
    {
      name: 'MethodOfCallRcvd',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Call_Back_Phone',
      dataType: 'varchar(20)',
      notNull: false,
    },
    {
      name: 'Caller_Type',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Caller_Name',
      dataType: 'varchar(80)',
      notNull: false,
    },
    {
      name: 'Caller_Location_Name',
      dataType: 'varchar(400)',
      notNull: false,
    },
    {
      name: 'Caller_Address',
      dataType: 'varchar(400)',
      notNull: false,
    },
    {
      name: 'Caller_Apartment',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'Caller_City',
      dataType: 'varchar(35)',
      notNull: false,
    },
    {
      name: 'Caller_State',
      dataType: 'varchar(5)',
      notNull: false,
    },
    {
      name: 'Caller_Postal_Code',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'Caller_County',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Caller_Location_Phone',
      dataType: 'varchar(20)',
      notNull: false,
    },
    {
      name: 'Time_PhonePickUp',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'Time_FirstCallTakingKeystroke',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'Time_CallEnteredQueue',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'Time_CallTakingComplete',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'Time_Incident_Under_Control',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'Time_CallClosed',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'Time_SentToOtherCAD',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'Time_First_Unit_Assigned',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'Time_First_Unit_Enroute',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'Time_First_Unit_Arrived',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'Elapsed_CallRcvd2InQueue',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'Elapsed_CallRcvd2CalTakDone',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'Elapsed_InQueue_2_FirstAssign',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'Elapsed_CallRcvd2FirstAssign',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'Elapsed_Assigned2FirstEnroute',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'Elapsed_Enroute2FirstAtScene',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'Elapsed_CallRcvd2CallClosed',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'CallTaking_Performed_By',
      dataType: 'varchar(80)',
      notNull: false,
    },
    {
      name: 'CallClosing_Performed_By',
      dataType: 'varchar(80)',
      notNull: false,
    },
    {
      name: 'CallDisposition_Performed_By',
      dataType: 'varchar(80)',
      notNull: false,
    },
    {
      name: 'Fixed_Time_PhonePickUp',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'Fixed_Time_CallEnteredQueue',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'Fixed_Time_CallTakingComplete',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'Fixed_Time_CallClosed',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'Fixed_Time_SentToOtherCAD',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'OnCall_ID',
      dataType: 'int',
      notNull: false,
    },
    {
      name: 'Transfer_Return_Flag',
      dataType: 'tinyint',
      notNull: false,
    },
    {
      name: 'EMD_Used',
      dataType: 'smallint',
      notNull: false,
    },
    {
      name: 'CIS_USed',
      dataType: 'smallint',
      notNull: false,
    },
    {
      name: 'Determinant',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'ProQa_CaseNumber',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'SentToBilling_Flag',
      dataType: 'bit',
      notNull: true,
    },
    {
      name: 'ANI_Number',
      dataType: 'varchar(20)',
      notNull: false,
    },
    {
      name: 'ALI_Info',
      dataType: 'varchar(50)',
      notNull: false,
    },
    {
      name: 'Command_Channel',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Primary_TAC_Channel',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Alternate_TAC_Channel',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Call_Disposition',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Cancel_Reason',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Late_Flag',
      dataType: 'char(1)',
      notNull: false,
    },
    {
      name: 'WhichQueue',
      dataType: 'varchar(1)',
      notNull: false,
    },
    {
      name: 'Confirmation_Number',
      dataType: 'varchar(20)',
      notNull: false,
    },
    {
      name: 'Incident_Name',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Building',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'Caller_Building',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'Certification_Level',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Base_Response_Number',
      dataType: 'varchar(20)',
      notNull: false,
    },
    {
      name: 'Call_Is_Active',
      dataType: 'int',
      notNull: false,
    },
    {
      name: 'Call_Source',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'CreatedByPrescheduleModule',
      dataType: 'varchar(1)',
      notNull: false,
    },
    {
      name: 'Multi_Patients',
      dataType: 'smallint',
      notNull: false,
    },
    {
      name: 'Call_Back_Phone_Ext',
      dataType: 'varchar(9)',
      notNull: false,
    },
    {
      name: 'Num_ANIALI_Calls',
      dataType: 'int',
      notNull: false,
    },
    {
      name: 'Delay_Reason',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Street_ID',
      dataType: 'int',
      notNull: false,
    },
    {
      name: 'PremiseID',
      dataType: 'int',
      notNull: false,
    },
    {
      name: 'MultiAgency_Ptr',
      dataType: 'int',
      notNull: false,
    },
    {
      name: 'MA911Problem_ID',
      dataType: 'int',
      notNull: false,
    },
    {
      name: 'RespReconfigState',
      dataType: 'tinyint',
      notNull: false,
    },
    {
      name: 'Call_Transfer_Receiving_Center',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'ClockStartTime',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'Call_Orig_OnHold',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'Call_Final_OffHold',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'House_Number',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'Prefix_Directional',
      dataType: 'varchar(22)',
      notNull: false,
    },
    {
      name: 'Name_Component',
      dataType: 'varchar(150)',
      notNull: false,
    },
    {
      name: 'Street_Type',
      dataType: 'varchar(15)',
      notNull: false,
    },
    {
      name: 'Post_Directional',
      dataType: 'varchar(22)',
      notNull: false,
    },
    {
      name: 'House_Number_Suffix',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'TimeFirstStaged',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'TimeFirstPTContact',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'TimeFirstDelayedAvail',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'TimeFirstCallCleared',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'StagedPerfBy',
      dataType: 'varchar(80)',
      notNull: false,
    },
    {
      name: 'PtContactPerfBy',
      dataType: 'varchar(80)',
      notNull: false,
    },
    {
      name: 'DelayedPerfBy',
      dataType: 'varchar(80)',
      notNull: false,
    },
    {
      name: 'CallClearedPerfBy',
      dataType: 'varchar(80)',
      notNull: false,
    },
    {
      name: 'ElapsedException',
      dataType: 'int',
      notNull: false,
    },
    {
      name: 'UnreadIncident',
      dataType: 'bit',
      notNull: true,
    },
    {
      name: 'UnreadComment',
      dataType: 'bit',
      notNull: true,
    },
    {
      name: 'CautionNote',
      dataType: 'bit',
      notNull: true,
    },
    {
      name: 'HazmatNote',
      dataType: 'bit',
      notNull: true,
    },
    {
      name: 'PremiseHistory',
      dataType: 'bit',
      notNull: true,
    },
    {
      name: 'CurrentDivision',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'HomeSectorID',
      dataType: 'int',
      notNull: false,
    },
    {
      name: 'CurrentSectorID',
      dataType: 'int',
      notNull: false,
    },
    {
      name: 'TimeCallViewed',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'RequestToCancel',
      dataType: 'bit',
      notNull: true,
    },
    {
      name: 'ActionInProgressBy',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'ActionType',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'TimeActionInProgress',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'AddressUpdateNeeded',
      dataType: 'bit',
      notNull: true,
    },
    {
      name: 'ResponsePlanType',
      dataType: 'tinyint',
      notNull: false,
    },
    {
      name: 'ResponseTimeLate',
      dataType: 'char(1)',
      notNull: false,
    },
    {
      name: 'ProQa_CaseNumber_Fire',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'ProQa_CaseNumber_Police',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'IntersectionStreetID',
      dataType: 'int',
      notNull: false,
    },
    {
      name: 'DispatchLevel',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'Stacked',
      dataType: 'tinyint',
      notNull: false,
    },
    {
      name: 'TimeFirstStacked',
      dataType: 'datetime',
      notNull: false,
    },
    {
      name: 'WillCallTransport',
      dataType: 'bit',
      notNull: true,
    },
    {
      name: 'Reopened',
      dataType: 'bit',
      notNull: true,
    },
    {
      name: 'DuplicatedFromID',
      dataType: 'int',
      notNull: false,
    },
    {
      name: 'MachineName',
      dataType: 'varchar(30)',
      notNull: false,
    },
    {
      name: 'CallTakerPhoneExtension',
      dataType: 'varchar(10)',
      notNull: false,
    },
    {
      name: 'CallBackPhoneID',
      dataType: 'int',
      notNull: false,
    },
    {
      name: 'CallerLocationPhoneID',
      dataType: 'int',
      notNull: false,
    },
  ],
});

export const responseVehiclesAssigned = sql.define({
  name: 'Response_Vehicles_Assigned',
  columns: [{
    name: 'ID',
    dataType: 'int',
    notNull: true,
  },
  {
    name: 'Master_Incident_ID',
    dataType: 'int',
    notNull: true,
  },
  {
    name: 'Agency_Type',
    dataType: 'varchar(30)',
    notNull: false,
  },
  {
    name: 'Jurisdiction',
    dataType: 'varchar(30)',
    notNull: false,
  },
  {
    name: 'Division',
    dataType: 'varchar(30)',
    notNull: false,
  },
  {
    name: 'Battalion',
    dataType: 'varchar(30)',
    notNull: false,
  },
  {
    name: 'Station',
    dataType: 'varchar(30)',
    notNull: false,
  },
  {
    name: 'Radio_Name',
    dataType: 'varchar(20)',
    notNull: true,
  },
  {
    name: 'Vehicle_ID',
    dataType: 'int',
    notNull: true,
  },
  {
    name: 'FR_MA_AA_Flag',
    dataType: 'varchar(2)',
    notNull: false,
  },
  {
    name: 'Time_PreAssigned',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Time_Assigned',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Time_Enroute',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Time_ArrivedAtScene',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Time_Staged',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Time_Contact',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Time_Delayed_Availability',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Time_Call_Cleared',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Time_BackInQts',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Elapsed_Assigned_2_Enroute',
    dataType: 'varchar(10)',
    notNull: false,
  },
  {
    name: 'Elapsed_Assigned_2_Arrival',
    dataType: 'varchar(10)',
    notNull: false,
  },
  {
    name: 'Elapsed_Assigned_2_Clear',
    dataType: 'varchar(10)',
    notNull: false,
  },
  {
    name: 'Fixed_Time_PreAssigned',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Fixed_Time_Assigned',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Fixed_Time_Enroute',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Fixed_Time_ArrivedAtScene',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Fixed_Time_Staged',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Fixed_Time_Contact',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Fixed_Time_DelayedAvailable',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Fixed_Time_Call_Cleared',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Fixed_Time_BackInQtrs',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'PreAssign_Performed_By',
    dataType: 'varchar(80)',
    notNull: false,
  },
  {
    name: 'Assign_Performed_By',
    dataType: 'varchar(80)',
    notNull: false,
  },
  {
    name: 'EnrouteToScene_Performed_By',
    dataType: 'varchar(80)',
    notNull: false,
  },
  {
    name: 'ArrivedAtScene_Performed_By',
    dataType: 'varchar(80)',
    notNull: false,
  },
  {
    name: 'BackInQtrs_Performed_By',
    dataType: 'varchar(80)',
    notNull: false,
  },
  {
    name: 'Staging_Performed_By',
    dataType: 'varchar(80)',
    notNull: false,
  },
  {
    name: 'Contact_Performed_By',
    dataType: 'varchar(80)',
    notNull: false,
  },
  {
    name: 'Delayed_Available_Performed_By',
    dataType: 'varchar(80)',
    notNull: false,
  },
  {
    name: 'Odometer_Enroute',
    dataType: 'float',
    notNull: false,
  },
  {
    name: 'Odometer_AtScene',
    dataType: 'float',
    notNull: false,
  },
  {
    name: 'Odometer_BackInQtrs',
    dataType: 'float',
    notNull: false,
  },
  {
    name: 'Cancel_Reason',
    dataType: 'varchar(30)',
    notNull: false,
  },
  {
    name: 'Delay_Reason',
    dataType: 'varchar(30)',
    notNull: false,
  },
  {
    name: 'Location_At_Assign_Time',
    dataType: 'varchar(400)',
    notNull: false,
  },
  {
    name: 'Longitude_At_Assign_Time',
    dataType: 'varchar(10)',
    notNull: false,
  },
  {
    name: 'Latitude_At_Assign_Time',
    dataType: 'varchar(10)',
    notNull: false,
  },
  {
    name: 'Vehicle_Info_ID',
    dataType: 'varchar(10)',
    notNull: true,
  },
  {
    name: 'Number_Of_Victims_Seen',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'Refusal_Number',
    dataType: 'varchar(15)',
    notNull: false,
  },
  {
    name: 'Crew_Tckt_Nmbr',
    dataType: 'varchar(15)',
    notNull: false,
  },
  {
    name: 'Call_Disposition',
    dataType: 'varchar(30)',
    notNull: false,
  },
  {
    name: 'Time_Avail_AtScene',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Fixed_Time_Avail_AtScene',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Avail_AtScene_Performed_By',
    dataType: 'varchar(80)',
    notNull: false,
  },
  {
    name: 'Cancel_Type',
    dataType: 'varchar(10)',
    notNull: false,
  },
  {
    name: 'Response_Number',
    dataType: 'varchar(20)',
    notNull: false,
  },
  {
    name: 'Calculate_ETA',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'Check_Assign_Flag',
    dataType: 'tinyint',
    notNull: false,
  },
  {
    name: 'Status_ID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'TimeStatusChanged',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'LateFlag',
    dataType: 'bit',
    notNull: true,
  },
  {
    name: 'PrimaryVehicleFlag',
    dataType: 'bit',
    notNull: true,
  },
  {
    name: 'Current_UnitRespPriorityCode',
    dataType: 'varchar(10)',
    notNull: false,
  },
  {
    name: 'Current_UnitRespPriorityDesc',
    dataType: 'varchar(30)',
    notNull: false,
  },
  {
    name: 'AlarmLevel',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'ResponseVehiclesStackedID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'ResponseVehiclesAssignedTypeID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'StrikeTeamID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'StrikeTeamVehicleRoleID',
    dataType: 'int',
    notNull: true,
  },
  {
    name: 'TimeMoveAfterResponding',
    dataType: 'datetime',
    notNull: false,
  },
  {
    name: 'LastTypeID',
    dataType: 'int',
    notNull: false,
  },
  {
    name: 'MeetsCriteria',
    dataType: 'varchar(512)',
    notNull: false,
  },
  {
    name: 'UnitResponsibility',
    dataType: 'varchar(100)',
    notNull: false,
  },
  ],
});
