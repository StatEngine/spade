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
    lastSettingsUpdate: 0,
  }

  constructor(props) {
    super(props);

    const status = ServiceHelper.status();

    this.state = {
      status: status === 'Started' ? 'Running' : 'Started',
      intervalId: undefined,
      lastServiceRestart: Date.now(),
    };
  }

  componentDidMount() {
    this.setState({
      intervalId: setInterval(() => this.setStatus(ServiceHelper.status()), 5000)
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  setStatus(newStatus) {
    const { status } = this.state;
    let { lastServiceRestart } = this.state;

    // If we're already running, ignore the state change.
    if (newStatus === 'Started' && status === 'Running') {
      return;
    }

    // Change our status to 'Running' soon after we start.
    if (newStatus === 'Started') {
      setTimeout(() => this.setState({ status: 'Running' }), 3000);
    }

    if (newStatus === 'Restarting') {
      lastServiceRestart = Date.now();
    }

    this.setState({
      status: newStatus,
      lastServiceRestart,
    });
  }

  checkServiceStatus() {
    this.setStatus(ServiceHelper.status());
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
              this.setStatus('Restarting');
              // I would prefer process.nextTick(), however, this allows
              // time for the UI to render once more... usually
              setTimeout(() => {
                ServiceHelper.addFullBat();
                this.setStatus(ServiceHelper.status());
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
    const settingsChanged = this.props.lastSettingsUpdate > this.state.lastServiceRestart;

    return (
      <div className={`${styles.container} ${settingsChanged || status !== 'Running' ? styles.visible : ''}`}>
        {this.renderContent()}
      </div>
    );
  }
}

Status.propTypes = {
  lastSettingsUpdate: PropTypes.number,
};
