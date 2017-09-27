import fs from 'fs';
import path from 'path';
import React, { Component, PropTypes } from 'react';
import { remote } from 'electron';
import { NumberInput } from 'material-ui-number-input';
import {
  Card,
  CardHeader,
  CardText,
  Divider,
  FlatButton,
  MenuItem,
  SelectField,
  Snackbar,
  TextField,
  Toggle,
} from 'material-ui';
import FileInput from './FileInput';
//import { DestinationS3Action } from '../destination-s3-action';
//import { SourceFileWatchAction } from '../source-file-watch-action';

export default class Settings extends Component {
  static configPath() {
    if (process.env.NODE_ENV === 'production') {
      return path.join(remote.app.getAppPath(), 'actions.json');
    }
    return path.join(__dirname, 'actions.json');
  }

  static loadConfig() {
    const configPath = Settings.configPath();
    console.log('----[ Settings.loadConfig, configPath: ', configPath);
    let result = { sources: {}, destinations: {} };
    try {
      result = Object.assign(result, JSON.parse(fs.readFileSync(configPath)));
    } catch (e) {
      console.log(`ERROR: Unable to load config file: "${configPath}". ${e}`)
    }
    return result;
  }

  static saveConfig(config) {
    const configPath = Settings.configPath();
    const formattedJson = JSON.stringify(config, null, '  ');

    try {
      fs.writeFileSync(configPath, formattedJson, 'utf8');
    } catch (e) {
      console.log(`ERROR: Unable to write to the config file: "${configPath}"! ${e}`);
    }
  }

  static intervalFromCron(cron) {
    const regex = /^\*\/(\d+)/g;
    const matches = regex.exec(cron || '*/1 * * * *');
    return matches ? matches[1] : '';
  }

  static cronFromInterval(interval) {
    return `*/${interval} * * * *`;
  }

  constructor(props) {
    super(props);

    this.alterSettings = this.alterSettings.bind(this);
    this.handleNotificationClose = this.handleNotificationClose.bind(this);

    this.state = {
      saved: false,
      config: {
      },
    };

    this.sourceTypes = [
      { key: 'fileWatch', label: 'File Watch', defaults: { folder: '', processed: { folder: '' } } },
      { key: 'mssql', label: 'MS SQL', defaults: { user: '', password: '', server: '', database: '', tables: [] } },
      { key: 'sqlite', label: 'SQLite', defaults: { user: '', password: '', server: '', database: '', tables: [], options: { encrypt: true } } },
    ];

    this.destinationTypes = [
      { key: 'create_s3', label: 'New S3 Connection', defaults: { s3: { bucket: 'departments', folder: '', accessKeyId: '', secretAccessKey: '' } } },
    ];

    // if (this.state.sourceFolder !== '') {
      // this.performWatch(this.state.sourceFolder);
    // }
  }

  componentWillMount() {
    const config = Settings.loadConfig();

    Object.keys(config.sources).sort()
      .forEach((key, index) => { config.sources[key].uid = index + 500; });

    Object.keys(config.destinations).sort()
      .forEach((key, index) => { config.destinations[key].uid = index + 500; });

    this.setState({
      config,
    });
  }
  validateSources(config, sourcesKeys) {
    /*for (let iSource = 0; iSource < sourcesKeys.length; iSource += 1) {
      const key = sourcesKeys[iSource];
      const sourceConfig = config.sources[key];
      if (sourceConfig.fileWatch) {
        if (SourceFileWatchAction.validateConfigProperties(sourceConfig) === false) {
          return false;
        }
      }
    }
    return true;
    */
    return true;
  }

  validateDestinations(config, destinationKeys) {
    /*for (let iDest = 0; iDest < destinationKeys.length; iDest += 1) {
      const key = destinationKeys[iDest];
      const destinationConfig = config.desinations[key];
      if (destinationConfig.s3) {
        if (DestinationS3Action.validateConfigProperties(destinationConfig) === false) {
          return false;
        }
      }
    }
    return true;
    */
    return true;
  }
  alterSettings() {
    const config = JSON.parse(JSON.stringify(this.state.config));
    const sourcesKeys = Object.keys(config.sources);
    const destinationsKeys = Object.keys(config.destinations);

    sourcesKeys.forEach(key => delete config.sources[key].uid);
    destinationsKeys.forEach(key => delete config.destinations[key].uid);

    this.setState({
      ...this.state,
      saved: true,
    });
    if (this.validateSources() && this.validateDestinations(config, destinationsKeys)) {
      Settings.saveConfig(config);
    }

    this.props.onUpdate(true);
    // TODO: run batch file to restart service

    console.log('this.data: ', this.state);
  }

  extractSourceType(source) {
    return this.sourceTypes.filter(st => st.key in source)[0].key;
  }

  handleNotificationClose() {
    this.setState({
      saved: false
    });
  }

  renderSourceInputs(sourceKey, source) {
    const sourceType = this.extractSourceType(source);
    const sourceConfig = source[sourceType];

    if (sourceType === 'fileWatch') {
      return (
        <div>
          <FileInput
            label="Folder"
            onChange={(e) => {
              sourceConfig.folder = e.target.value;
              this.alterSettings();
            }}
            value={sourceConfig.folder}
            webkitdirectory
          />
          <FileInput
            label="Processed Folder"
            onChange={(e) => {
              sourceConfig.processed.folder = e.target.value;
              this.alterSettings();
            }}
            value={sourceConfig.processed.folder}
            webkitdirectory
          />
        </div>
      );
    } else if (sourceType === 'mssql' || sourceType === 'sqlite') {
      const showEncrypt = 'options' in sourceConfig;

      return (
        <div>
          <TextField
            floatingLabelText="Username"
            value={sourceConfig.user}
            onChange={(e) => {
              sourceConfig.user = e.target.value;
              this.alterSettings();
            }}
          /><br />

          <TextField
            floatingLabelText="Password"
            value={sourceConfig.password}
            onChange={(e) => {
              sourceConfig.password = e.target.value;
              this.alterSettings();
            }}
          /><br />

          <TextField
            floatingLabelText="Server"
            value={sourceConfig.server}
            onChange={(e) => {
              sourceConfig.server = e.target.value;
              this.alterSettings();
            }}
          /><br />

          <TextField
            floatingLabelText="Database"
            value={sourceConfig.database}
            onChange={(e) => {
              sourceConfig.database = e.target.value;
              this.alterSettings();
            }}
          /><br />

          <br />

          {!showEncrypt ? <div /> :
          <div style={{ display: 'inline-block' }}>
            <Toggle
              label="Encrypt"
              toggled={sourceConfig.options.encrypt}
              onToggle={(e, isInputChecked) => {
                sourceConfig.options.encrypt = isInputChecked;
                this.alterSettings();
              }}
            />
          </div>
          }
        </div>
      );
    }

    return <div />;
  }

  renderSources() {
    const { config } = this.state;

    const sourcesKeys = Object
      .keys(config.sources)
      .sort((a, b) => config.sources[a].uid - config.sources[b].uid);

    const destinationKeys = Object
      .keys(config.destinations)
      .sort((a, b) => config.destinations[a].uid - config.destinations[b].uid);

    return sourcesKeys.map((sourceKey, index) => {
      const source = config.sources[sourceKey];
      const schedule = 'trigger' in source ? source.trigger.schedule : null;
      const interval = Settings.intervalFromCron(schedule);
      const sourceType = this.extractSourceType(source);
      const sourceTypeLabel = this.sourceTypes.find(st => st.key === sourceType).label;

      let destination;
      let destinationTypeLabel;
      let destinationConfig = this.destinationTypes[0].defaults.s3;
      if (source.destination in config.destinations) {
        // TODO: this can't assume 's3' in the future, build a more robust solution
        destination = config.destinations[source.destination];
        destinationTypeLabel = 'S3';
        destinationConfig = destination.s3;
      }

      return (
        <Card key={`source-${source.uid}`} style={{ marginBottom: '16px' }}>
          <CardHeader
            actAsExpander
            showExpandableButton
            title={`${sourceTypeLabel} > ${destinationTypeLabel} - (${sourceKey})`}
          />

          <CardText expandable style={{ padding: '0 32px 16px' }}>
            <TextField
              floatingLabelText="Name"
              value={sourceKey}
              onChange={(e) => {
                config.sources[e.target.value] = Object.assign({}, source);
                delete config.sources[sourceKey];
                this.alterSettings();
              }}
            /><br />

            <NumberInput
              floatingLabelText="Interval (minutes)"
              min={0}
              onChange={(e) => {
                if (schedule) {
                  source.trigger.schedule = Settings.cronFromInterval(e.target.value);
                  this.alterSettings();
                }
              }}
              required
              style={{ width: '128px', marginRight: '22px' }}
              value={interval}
            />

            <div style={{ display: 'inline-block' }}>
              <Toggle
                label="Enabled"
                onToggle={(e, isInputChecked) => {
                  source.enabled = isInputChecked;
                  this.alterSettings();
                }}
                toggled={source.enabled}
              />
            </div>

            <br />

            <div style={{ margin: '20px 0' }}>
              <SelectField
                floatingLabelText="Source"
                onChange={(e, index, value) => {
                  // Back up the old settings before discarding them
                  source[`_${sourceType}`] = source[sourceType];
                  delete source[sourceType];

                  // Resore backed up settings (if any) and clean up
                  source[value] = Object.assign({},
                    this.sourceTypes.filter(st => st.key === value)[0].defaults,
                    source[`_${value}`],
                  );
                  delete source[`_${value}`];

                  this.alterSettings();
                }}
                value={sourceType}
              >
                {this.sourceTypes.map(({ key, label }) =>
                  <MenuItem key={key} value={key} primaryText={label} />
                )}
              </SelectField>

              {this.renderSourceInputs(sourceKey, source)}
            </div>

            <div style={{ margin: '20px 0' }}>
              <SelectField
                floatingLabelText="Destination"
                onChange={(e, index, value) => {
                  if (!(source.destination in config.destinations)) {
                    // TODO; think through how we want to handle destination creation
                    let newDestinationKey = 'destination';
                    let i = 1;
                    while (sourcesKeys.indexOf(newDestinationKey + i) !== -1) {
                      i += 1;
                    }
                    newDestinationKey = newDestinationKey + i;

                    config.destinations[newDestinationKey] = Object.assign({},
                      this.destinationTypes[0].defaults,
                      { uid: Math.random() }
                    );
                    config.destination[newDestinationKey].s3.folder = config.departmentId;
                    source.destination = newDestinationKey;
                  } else {
                    source.destination = value;
                  }
                  this.alterSettings();
                }}
                value={source.destination}
              >
                {destinationKeys.map(key =>
                  <MenuItem key={key} value={key} primaryText={key} />
                )}

                <Divider />

                {this.destinationTypes.map(({ key, label }) =>
                  <MenuItem key={key} value={key} primaryText={label} />
                )}
              </SelectField>

              <div>
                <TextField
                  floatingLabelText="Folder"
                  value={destinationConfig.folder}
                  onChange={(e) => {
                    destinationConfig.folder = e.target.value;
                    this.alterSettings();
                  }}
                /><br />

                <TextField
                  floatingLabelText="Access Key ID"
                  value={destinationConfig.accessKeyId}
                  onChange={(e) => {
                    destinationConfig.accessKeyId = e.target.value;
                    this.alterSettings();
                  }}
                /><br />

                <TextField
                  floatingLabelText="Secret Access Key"
                  value={destinationConfig.secretAccessKey}
                  onChange={(e) => {
                    destinationConfig.secretAccessKey = e.target.value;
                    this.alterSettings();
                  }}
                /><br />
              </div>
            </div>
          </CardText>
        </Card>
      );
    });
  }

  render() {
    const { config } = this.state;
    const sourcesKeys = Object.keys(config.sources);

    return (
      <div style={{ margin: 'auto', maxWidth: '600px', padding: '16px 32px 32px' }}>
        <Snackbar
          open={this.state.saved}
          message="Settings Saved!"
          autoHideDuration={3000}
          onRequestClose={this.handleNotificationClose}
        />
        <TextField
          floatingLabelText="Department ID"
          onChange={(e) => {
            config.departmentId = e.target.value;
            this.alterSettings();
          }}
          value={config.departmentId}
        />

        <br /><br />

        <div style={{ margin: '1em 0' }}>
          <span style={{ fontSize: '1em', fontWeight: 'bold', marginRight: '22px' }}>
            Tasks
          </span>

          <FlatButton
            label="Add"
            onClick={() => {
              // generate a new name
              let newSourceKey = 'newSource';
              let i = 1;
              while (sourcesKeys.indexOf(newSourceKey + i) !== -1) {
                i += 1;
              }
              newSourceKey += i;

              // TODO: this should be a deep clone (along with ALL similar
              // patterns using sourceTypes/destinationTypes in this file)
              const destKeys = Object.keys(config.destinations);
              let destination = null;
              if (destKeys.length !== 0) {
                destination = destKeys[0];
              }
              config.sources[newSourceKey] = Object.assign({}, {
                enabled: false,
                // TODO: this next line would crash if no destinations
                destination: destination,
                [this.sourceTypes[0].key]: this.sourceTypes[0].defaults,
                uid: Math.random(),
              });
              this.alterSettings();
            }}
            primary
          />
        </div>

        {this.renderSources()}
      </div>
    );
  }
}

Settings.propTypes = {
  onUpdate: PropTypes.func.isRequired,
};
