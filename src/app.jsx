import React from 'react';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Settings from 'electron-settings';
<<<<<<< HEAD
import path from 'path';
import fs from 'fs';
import mvElseCp from 'mv';
import watch from 'gulp-watch';

=======
>>>>>>> 1st pass at app with multiple source file watch actions

const dialog = require('electron').remote.dialog

const config = {
  accessKeyId: 'YOURACCESSKEY',
  secretAccessKey: 'YOUACCESSSECRET',
};

const s3 = require('gulp-s3-upload')(config);

let self = null;

export default class App extends React.Component {

  constructor(props) {
    super(props);
    self = this;
    this.saveSettings = this.saveSettings.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.state = Settings.get('state') || {
      deparmentId: '1234',
      username: 'syrusm',
      password: '',
      sourceFolder: '',
      destinationFolder: '',
      consented: true
    };

    if (this.state.sourceFolder !== '') {
      //this.performWatch(this.state.sourceFolder);
    }
  }

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

/*
  onStreamError(e) {
    console.log(e);
  }
*/

  handleTextFieldChange(e) {
    console.log('-- handler... ');
    this.state[e.target.id] = e.target.value;
  }

  toggleCheckbox(e) {
    var state = {};
    state[e.target.id] = e.target.checked;
    this.setState(state);
  }

  saveSettings(e) {
    console.log('----[ Save: ', this.state);
    e.preventDefault();
    console.log('this.data: ', this.state);

    Settings.set('state', this.state);
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title="Spade"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
          <div style={{ margin: 'auto', width: '250px' }}>
            <form onSubmit={this.saveSettings}>
              <TextField
                id="deparmentId"
                floatingLabelText="Department ID"
                value={this.state.deparmentId}
                onChange={this.handleTextFieldChange}
              /><br />
              <TextField
                id="username"
                floatingLabelText="Username"
                value={this.state.username}
                onChange={this.handleTextFieldChange}
              /><br />
              <TextField
                id="password"
                floatingLabelText="Password"
                type="password"
                value={this.state.password}
                onChange={this.handleTextFieldChange}
              /><br />
              <TextField
                id="sourceFolder"
                floatingLabelText="Source Folder"
                value={this.state.sourceFolder}
                onChange={this.handleTextFieldChange}
              /><br />
              <TextField
                id="destinationFolder"
                floatingLabelText="Destination Folder"
                value={this.state.destinationFolder}
                onChange={this.handleTextFieldChange}
              /><br />
              <br />
              <Checkbox
                id="consented"
                label="Send diagnosis statistics."
                style={{marginBottom: 16}}
                onCheck={this.toggleCheckbox}
                checked={this.state.consented}
              />
              <br />
              <RaisedButton
                type="submit"
                label="Save"
                style={{ margin: 12 }}
              />
            </form>
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
