import React from 'react';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Settings from 'electron-settings';
import {NumberInput} from "material-ui-number-input";
import {Card, CardHeader, CardText, DropDownMenu, FlatButton, MenuItem, Toggle} from "material-ui";

// let self = null;

export default class App extends React.Component {

  constructor(props) {
    super(props);
    // self = this;
    this.saveSettings = this.saveSettings.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.state = Settings.get('state') || {
      deparmentId: '1234',
      consented: true,
      tasks: [],
    };

    this.sourceTypes = {
      fileWatch: 'File Watch',
      mssql: 'MS SQL',
      sqlite: 'SQLite',
    };

    this.destinationTypes = {
      s3: 'S3',
    };

    // if (this.state.sourceFolder !== '') {
      // this.performWatch(this.state.sourceFolder);
    // }
  }

  /*
  chooseSource() {
    dialog.showOpenDialog({
      title: 'Choose Source Directory',
      properties: ['openDirectory'],
    },
    (filePaths) => {
      self.state.sourceFolder = filePaths[0];
      self.setState(self.state);
      self.performWatch(filePaths[0]);
    });
  }

  onStreamError(e) {
    console.log(e);
  }
*/

  handleTextFieldChange(e) {
    console.log('-- handler... ');
    this.state[e.target.id] = e.target.value;
  }

  toggleCheckbox(e) {
    const state = {};
    state[e.target.id] = e.target.checked;
    this.setState(state);
  }

  saveSettings(e) {
    console.log('----[ Save: ', this.state);
    e.preventDefault();
    console.log('this.data: ', this.state);

    Settings.set('state', this.state);
  }

  addTask() {
    const task = {
      key: Math.random(),
      interval: '1',
      source: {
        type: 'fileWatch',
        folder: '',
        processedFolder: '',
        user: '',
        password: '',
        server: '',
        database: '',
        encrypt: true,
      },
      destination: {
        type: 's3',
        folder: '',
        accessKeyId: '',
        secretAccessKey: '',
      }
    };

    this.setState({tasks: [task].concat(this.state.tasks)});
  }

  resetTaskSource(task) {
    task.source = {
      type: task.source.type,
      folder: '',
      processedFolder: '',
      user: '',
      password: '',
      server: '',
      database: '',
      encrypt: true,
    };
  }

  resetTaskDestination(task) {
    task.destination = {
      type: task.destination.type,
      folder: '',
      accessKeyId: '',
      secretAccessKey: '',
    };
  }

  render() {
    const tasks = this.state.tasks.map((task) => {
      const sourceTypes = [];
      for (let key in this.sourceTypes) {
        if (this.sourceTypes.hasOwnProperty(key)) {
          sourceTypes.push((
            <MenuItem key={key} value={key} primaryText={this.sourceTypes[key]} />
          ));
        }
      }

      const destinationTypes = [];
      for (let key in this.destinationTypes) {
        if (this.destinationTypes.hasOwnProperty(key)) {
          destinationTypes.push((
            <MenuItem key={key} value={key} primaryText={this.destinationTypes[key]} />
          ));
        }
      }

      let sourceInputs;
      if (task.source.type === 'fileWatch') {
        sourceInputs = (
          <div>
            <TextField
              key="source-folder"
              floatingLabelText="Folder"
              value={task.source.folder}
              style={{ marginRight: '10px' }}
              onChange={(e) => {
                task.source.folder = e.target.value;
                this.forceUpdate();
              }}
            />
            <FlatButton
              label="Browse..."
              onClick={() => {
                document.getElementById(`${task.uid}-source-file-input`).click();
              }}
            />
            <input
              id={`${task.uid}-source-file-input`}
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => {
                task.source.folder = e.target.value;
                this.forceUpdate();
              }}
            />

            <TextField
              key="source-processed-folder"
              floatingLabelText="Processed Folder"
              value={task.source.processedFolder}
              style={{ marginRight: '10px' }}
              onChange={(e) => {
                task.source.processedFolder = e.target.value;
                this.forceUpdate();
              }}
            />
            <FlatButton
              label="Browse..."
              onClick={() => {
                document.getElementById(`${task.uid}-processed-file-input`).click();
              }}
            />
            <input
              id={`${task.uid}-processed-file-input`}
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => {
                task.source.processedFolder = e.target.value;
                this.forceUpdate();
              }}
            />
          </div>
        );
      } else if (task.source.type === 'mssql' || task.source.type === 'sqlite') {
        sourceInputs = (
          <div>
            <TextField
              key="source-username"
              floatingLabelText="Username"
              value={task.source.username}
              onChange={(e) => {
                task.source.username = e.target.value;
                this.forceUpdate();
              }}
            /><br />

            <TextField
              key="source-password"
              floatingLabelText="Password"
              value={task.source.password}
              onChange={(e) => {
                task.source.password = e.target.value;
                this.forceUpdate();
              }}
            /><br />

            <TextField
              key="source-server"
              floatingLabelText="Server"
              value={task.source.server}
              onChange={(e) => {
                task.source.server = e.target.value;
                this.forceUpdate();
              }}
            /><br />

            <TextField
              key="source-database"
              floatingLabelText="Database"
              value={task.source.database}
              onChange={(e) => {
                task.source.database = e.target.value;
                this.forceUpdate();
              }}
            /><br />

            <br />

            <div style={{ display: 'inline-block' }}>
              <Toggle
                label="Encrypt"
                value={task.source.encrypt}
                onChange={(e) => {
                  task.source.encrypt = e.target.value;
                  this.forceUpdate();
                }}
              />
            </div>
          </div>
        )
      }

      let destinationInputs;
      if (task.destination.type === 's3') {
        destinationInputs = (
          <div>
            <TextField
              floatingLabelText="Folder"
              value={task.destination.folder}
              onChange={(e) => {
                task.destination.folder = e.target.value;
                this.forceUpdate();
              }}
            /><br />

            <TextField
              floatingLabelText="Access Key ID"
              value={task.destination.accessKeyId}
              onChange={(e) => {
                task.destination.accessKeyId = e.target.value;
                this.forceUpdate();
              }}
            /><br />

            <TextField
              floatingLabelText="Secret Access Key"
              value={task.destination.secretAccessKey}
              onChange={(e) => {
                task.destination.secretAccessKey = e.target.value;
                this.forceUpdate();
              }}
            /><br />
          </div>
        );
      }

      return (
        <Card key={task.key} initiallyExpanded={true} style={{ marginBottom: '16px' }}>
          <CardHeader
            title={this.sourceTypes[task.source.type] + ' > ' + this.destinationTypes[task.destination.type]}
            actAsExpander={true}
            showExpandableButton={true}
          >
          </CardHeader>

          <CardText expandable={true} style={{padding: '0 32px 16px'}}>
            <NumberInput
              floatingLabelText="Interval (minutes)"
              min={0}
              value={task.interval}
              required={true}
              onChange={(e) => {
                task.interval = e.target.value;
                this.setState();
              }}
              style={{ width: '128px', marginRight: '22px' }}
            />

            <div style={{ display: 'inline-block' }}>
              <Toggle
                label="Enabled"
              />
            </div>

            <br />

            <div style={{ margin: '20px 0' }}>
              <h4 style={{ marginBottom: '0' }}>Source</h4>
              <DropDownMenu
                value={task.source.type}
                onChange={(e, index, value) => {
                  task.source.type = value;
                  this.resetTaskSource(task);
                  this.forceUpdate();
                }}
                style={{ position: 'relative', left: '-24px' }}>
                {sourceTypes}
              </DropDownMenu>
              {sourceInputs}
            </div>

            <div style={{ margin: '20px 0' }}>
              <h4 style={{ marginBottom: '0' }}>Destination</h4>
              <DropDownMenu
                value={task.destination.type}
                onChange={(e, index, value) => {
                  task.destination.type = value;
                  this.resetTaskDestination(task);
                  this.forceUpdate();
                }}
                style={{ position: 'relative', left: '-24px' }}>
                {destinationTypes}
              </DropDownMenu>
              {destinationInputs}
            </div>
          </CardText>
        </Card>
      );
    });

    const maxHeight = window.innerHeight - 64;

    return (
      <MuiThemeProvider>
        <div style={{fontFamily: 'Roboto, sans-serif'}}>
          <AppBar
            title="Spade"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
          <div style={{ maxHeight: maxHeight, overflow: 'auto' }}>
            <div style={{ margin: 'auto', maxWidth: '600px', padding: '16px 32px 32px' }}>
              <TextField
                id="deparmentId"
                floatingLabelText="Department ID"
                value={this.state.deparmentId}
                onChange={this.handleTextFieldChange}
              />

              <br /><br />

              <div
                style={{ margin: '1em 0' }}>
                <span
                  style={{ fontSize: '1em', fontWeight: 'bold', marginRight: '22px' }}>
                  Tasks
                </span>

                <FlatButton
                  label="Add"
                  primary={true}
                  onClick={(e) => {this.addTask(e)}}
                />
              </div>
              {tasks}
            </div>
          </div>
        </div>
      </MuiThemeProvider>);
  }
}

/**
<RaisedButton
  label="Choose a source directory"
  labelPosition="before"
  containerElement="label"
  onClick={this.chooseSource.bind(this)}
/>


 <RaisedButton
 containerElement='label' // <-- Just add me!
 label='source'>
 <input type="file" />
 </RaisedButton><br />

 //e.target.value
 //const formData = {};
 //for (const field in this.refs) {
 //  formData[field] = this.refs[field].value;
 //  Settings.set(field, formData[field]);
 //}

 */
