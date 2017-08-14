// @flow
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import styles from './Status.css';
import ActionCheckCircle from 'material-ui/svg-icons/action/check-circle';
import AlertWarning from 'material-ui/svg-icons/alert/warning';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import ServiceHelper from '../service/service-helper';
import HourglassEmpty from 'material-ui/svg-icons/action/hourglass-empty';

const iconStyles = {
  height: 32,
  width: 32,
  marginRight: 24,
  marginTop: 12,
  marginLeft: 12,
  marginBottom: -12,
};

export default class Status extends Component {
  props: {
    lastSettingsUpdate: undefined,
  }

  constructor(props) {
    super(props);

    this.state = {
      status: ServiceHelper.status(),
      intervalId: undefined,
      lastServiceRestart: Date.now(),
    };
  }

  componentDidMount() {
    this.setState({
      intervalId: setInterval(() => this.setState({ status: ServiceHelper.status() }), 5000)
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  checkServiceStatus() {
    this.setState({
      status: ServiceHelper.status(),
    });
  }

  renderContent() {
    const { status } = this.state;
    const settingsChanged = this.props.lastSettingsUpdate > this.state.lastServiceRestart;

    if (status === 'Restarting') {
      return (
        <div>
          <HourglassEmpty color="#FFCC33" style={iconStyles} />
          {'The service is restarting.'}

          {/*<CircularProgress size={32} thickness={4} color="#FFCC33" style={iconStyles} />
          <span style={{ top: -12, position: 'relative', marginRight: 12 }}>
            {'The service is restarting.'}
          </span>
          */}
        </div>
      );
    }

    if (status === 'Stopped' || status === 'NonExistent' || settingsChanged) {
      return (
        <div>
          <AlertWarning color="#FF9911" style={iconStyles} />
          <span style={{ marginRight: 12 }}>
            {settingsChanged ? 'Restart the service to apply changes.' : 'The service is not running.'}
          </span>
          <FlatButton
            label={settingsChanged ? 'Restart Now' : 'Start Service'}
            onClick={() => {
              this.setState({ status: 'Restarting' });
              // I would prefer process.nextTick(), however, this allows
              // time for the UI to render once more... usually
              setTimeout(() => {
                ServiceHelper.addFullBat();
                this.setState({
                  status: ServiceHelper.status(),
                  lastServiceRestart: Date.now(),
                });
              }, 10);
            }}
            secondary
          />
        </div>
      );
    }

    if (status === 'Started') {
      return (
        <div>
          <ActionCheckCircle color="#008800" style={iconStyles} />
          {'The service has successfully started!'}
        </div>
      );
    }

    return undefined;
  }

  render() {
    const { status } = this.state;
    console.log('asdf');
    return (
      <div className={`${styles.container} ${status !== 'Running' ? styles.visible : ''}`}>
        {this.renderContent()}
      </div>
    );
  }
}

Status.propTypes = {
  lastSettingsUpdate: PropTypes.number,
};
