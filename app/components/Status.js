// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import styles from './Status.css';
import ActionCheckCircle from 'material-ui/svg-icons/action/check-circle';
import AlertWarning from 'material-ui/svg-icons/alert/warning';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import ServiceHelper from '../service/service-helper';

const iconStyles = {
  height: 32,
  width: 32,
  marginRight: 24,
  marginTop: 12,
  marginLeft: 12,
  marginBottom: -12,
};

export default class Status extends Component {
  constructor() {
    super();

    this.state = {
      status: 'running',
      intervalId: undefined,
    };
  }

  componentDidMount() {
     this.setState({
       intervalId: setInterval(this.checkServiceStatus.bind(this), 4000)
     });
  },

  componentWillUnmount() {
     clearInterval(this.state.intervalId);
  },

  checkServiceStatus() {
    const { status } = this.state;
    // const serviceStatus = ServiceHelper.status();

    if (status === 'restarting') {
      this.setStatus('started');
    }

    if (status === 'running') {
      this.setStatus('stopped');
    }
  }

  setStatus(newStatus) {
    if (newStatus === 'started') {
      setTimeout(() => {
        this.setState({ status: 'running' });
      }, 2000);
    }

    this.setState({ status: newStatus });
  }

  renderContent() {
    const { status } = this.state;

    if (status === 'restarting') {
      return (
        <div>
          <CircularProgress size={32} thickness={4} color="#FFCC33" style={iconStyles} />
          <span style={{ top: -12, position: 'relative', marginRight: 12 }}>
            {'The service is restarting.'}
          </span>
        </div>
      );
    }

    if (status === 'started') {
      return (
        <div>
          <ActionCheckCircle color="#008800" style={iconStyles} />
          {'The service has successfully started!'}
        </div>
      );
    }

    if (status === 'stopped') {
      return (
        <div>
          <AlertWarning color="#FF9911" style={iconStyles} />
          <span style={{ marginRight: 12 }}>
            {'The service is not running.'}
          </span>
          <FlatButton
            label="Start Service"
            onClick={() => {
              // ServiceHelper.addFull();
              this.setStatus('restarting');
            }}
            secondary
          />
        </div>
      );
    }

    return undefined;
  }

  render() {
    const { status } = this.state;

    return (
      <div className={`${styles.container} ${status !== 'running' ? styles.visible : ''}`}>
        {this.renderContent()}
      </div>
    );
  }
};
