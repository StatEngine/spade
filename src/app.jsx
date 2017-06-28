import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Settings from 'electron-settings';
import gulp from 'gulp';
import watch from 'gulp-watch'
import clean from 'gulp-clean'

const dialog = require('electron').remote.dialog


// Needed for onTouchTap
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();


export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.saveSettings = this.saveSettings.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.state = Settings.get('state') || {
      deparmentId: '1234',
      username: 'syrusm',
      password: '',
      sourceFolder: '',
      destinationFolder: '',
    };

    if( this.state['sourceFolder'] !== '') {
      this.performWatch(this.state['sourceFolder']);
    }
  }

  chooseSource(e) {
    let self = this;
    dialog.showOpenDialog({
      title: 'Choose Source Directory',
      properties: ['openDirectory']
    },function(filePaths) {
      self.state['sourceFolder'] = filePaths[0];
      self.setState(self.state);
      self.performWatch(filePaths[0]);
    })
  }

  performWatch(directoryToWatch) {
    console.log('Performing watch on ', directoryToWatch);
    let watchPattern = directoryToWatch + '\\*'
    watch(watchPattern, { events: ['add']})
    .pipe(clean({force: true}))
    .pipe(gulp.dest('processed'));
  }

  handleTextFieldChange(e) {
    console.log('-- handler... ');
    this.state[e.target.id] = e.target.value;
    this.setState(this.state);
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
              <RaisedButton
                type="submit"
                label="Save"
                style={{ margin: 12 }}
              />
              <RaisedButton
                label="Choose a source directory"
                labelPosition="before"
                containerElement="label"
                onClick={this.chooseSource.bind(this)}
              >
              </RaisedButton>

            </form>
          </div>
        </div>
      </MuiThemeProvider>);
  }
}

/**
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
