import fs from 'fs';
import path from 'path';
import React from 'react';
import { NumberInput } from 'material-ui-number-input';
import {
  Card,
  CardHeader,
  CardText,
  Divider,
  FlatButton,
  MenuItem,
  SelectField,
  TextField,
  Toggle,
} from 'material-ui';
import FileInput from './FileInput';

export default class Settings extends React.Component {
  static configPath() {
    // TODO: verify that these cases work when running as an executable
    if (process.env.NODE_ENV === 'production') {
      return path.join(process.cwd(), 'app', 'actions.json');
    }
    return path.join(__dirname, 'actions.json');
  }

  static loadConfig() {
    const configPath = Settings.configPath();
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

    this.saveSettings = this.saveSettings.bind(this);

    this.state = {
      loading: true,
      config: {
      },
    };

    this.sourceTypes = [
      { key: 'fileWatch', label: 'File Watch', defaults: { folder: '', processed: { folder: '' } } },
      { key: 'mssql', label: 'MS SQL', defaults: { user: '', password: '', server: '', database: '', tables: [] } },
      { key: 'sqlite', label: 'SQLite', defaults: { user: '', password: '', server: '', database: '', tables: [], options: { encrypt: true } } },
    ];

    this.destinationTypes = [
      { key: 'create_s3', label: 'New S3 Connection', defaults: { s3: { Bucket: '', folder: '', accessKeyId: '', secretAccessKey: '' } } },
    ];

    // if (this.state.sourceFolder !== '') {
      // this.performWatch(this.state.sourceFolder);
    // }
  }

  componentWillMount() {
    const config = Settings.loadConfig();

    this.setState({
      config,
    });
  }

  saveSettings() {
    this.setState(this.state);
    Settings.saveConfig(this.state.config);
    // TODO: run batch file to restart service

    console.log('this.data: ', this.state);
  }

  extractSourceType(source) {
    return this.sourceTypes.filter(st => st.key in source)[0].key;
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
              this.saveSettings();
            }}
            value={sourceConfig.folder}
          />
          <FileInput
            label="Processed Folder"
            onChange={(e) => {
              sourceConfig.processed.folder = e.target.value;
              this.saveSettings();
            }}
            value={sourceConfig.processed.folder}
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
              this.saveSettings();
            }}
          /><br />

          <TextField
            floatingLabelText="Password"
            value={sourceConfig.password}
            onChange={(e) => {
              sourceConfig.password = e.target.value;
              this.saveSettings();
            }}
          /><br />

          <TextField
            floatingLabelText="Server"
            value={sourceConfig.server}
            onChange={(e) => {
              sourceConfig.server = e.target.value;
              this.saveSettings();
            }}
          /><br />

          <TextField
            floatingLabelText="Database"
            value={sourceConfig.database}
            onChange={(e) => {
              sourceConfig.database = e.target.value;
              this.saveSettings();
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
                this.saveSettings();
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
    const sourcesKeys = Object.keys(config.sources);
    const destinationKeys = Object.keys(config.destinations);

    return sourcesKeys.map((sourceKey) => {
      const source = config.sources[sourceKey];
      const schedule = 'trigger' in source ? source.trigger.schedule : null;
      const interval = Settings.intervalFromCron(schedule);
      const sourceType = this.extractSourceType(source);
      const sourceTypeLabel = this.sourceTypes.find(st => st.key === sourceType).label;

      let destination;
      let destinationTypeLabel;
      let destinationConfig = {};
      if (source.destination in config.destinations) {
        // TODO: this can't assume 's3' in the future, build a more robust solution
        destination = config.destinations[source.destination];
        destinationTypeLabel = 'S3';
        destinationConfig = destination.s3;
      }

      return (
        <Card key={sourceKey} style={{ marginBottom: '16px' }}>
          <CardHeader
            actAsExpander
            showExpandableButton
            title={`${sourceTypeLabel} > ${destinationTypeLabel} - (${sourceKey})`}
          />

          <CardText expandable style={{ padding: '0 32px 16px' }}>
            <NumberInput
              floatingLabelText="Interval (minutes)"
              min={0}
              onChange={(e) => {
                if (schedule) {
                  source.trigger.schedule = Settings.cronFromInterval(e.target.value);
                  this.saveSettings();
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
                  this.saveSettings();
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

                  this.saveSettings();
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
                    const newDestinationName = 'newDestination';
                    config.destinations[newDestinationName] = Object.assign({},
                      this.destinationTypes[0].defaults,
                    );
                    source.destination = newDestinationName;
                  } else {
                    source.destination = value;
                  }
                  this.saveSettings();
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
                    this.saveSettings();
                  }}
                /><br />

                <TextField
                  floatingLabelText="Access Key ID"
                  value={destinationConfig.accessKeyId}
                  onChange={(e) => {
                    destinationConfig.accessKeyId = e.target.value;
                    this.saveSettings();
                  }}
                /><br />

                <TextField
                  floatingLabelText="Secret Access Key"
                  value={destinationConfig.secretAccessKey}
                  onChange={(e) => {
                    destinationConfig.secretAccessKey = e.target.value;
                    this.saveSettings();
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

    return (
      <div style={{ margin: 'auto', maxWidth: '600px', padding: '16px 32px 32px' }}>
        <TextField
          floatingLabelText="Department ID"
          onChange={(e) => {
            config.departmentId = e.target.value;
            this.saveSettings();
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
              // TODO: this should be a deep clone (along with ALL similar
              // patterns using sourceTypes/destinationTypes in this file)
              config.sources.newSource = Object.assign({}, {
                enabled: false,
                // TODO: this next line would crash if no destinations
                destination: Object.keys(config.destinations)[0],
                [this.sourceTypes[0].key]: this.sourceTypes[0].defaults,
              });
              this.saveSettings();
            }}
            primary
          />
        </div>

        {this.renderSources()}
      </div>
    );
  }
}
