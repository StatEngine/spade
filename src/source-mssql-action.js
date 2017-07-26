import SourceAction from './actions';


export default class SourceMssqlAction extends SourceAction {
  constructor(config, destination) {
    super(config, destination);
    console.log('SourceMssqlAction.constructor: ', this.config);
  }

  init() {
    // TODO: create connection object and connect to db testing creds & params
    this.startSchedule();
  }

  run() {
    console.log('----[ SourceMssqlAction.run start');
    const denomalizedRecords = [
      {
        incidentId: 10,
        location: '-40.7, 20.033',
        dateTime: '1/2/10 4:29 pm',
      },
      {
        incidentId: 10,
        location: '-40.7, 20.033',
        dateTime: '1/2/10 4:29 pm',
      },
      {
        incidentId: 10,
        location: '-40.7, 20.033',
        dateTime: '1/2/10 4:29 pm',
      },
    ];

    const promises = [];
    for (let i = 0; i < denomalizedRecords.length; i += 1) {
      promises.push(this.destination.run(denomalizedRecords[i]));
    }

    Promise.all(promises).then((values) => {
      // TODO: if all the returned values are a success, consider this a success
      console.log('----[ SourceMssqlAction all records sent: ', values);
    }, (e) => {
      console.log('Unable to send one or more DB records', e);
    });
  }

  finalize() {
    console.log('SourceMssqlAction.finalize: ', this.config);
  }
}
