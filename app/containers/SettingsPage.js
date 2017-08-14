// @flow
import React, { Component } from 'react';
import Settings from '../components/Settings';
import Status from '../components/Status';

export default class SettingsPage extends Component {
  constructor() {
    super();

    this.state = {
      lastSettingsUpdate: undefined,
    };
  }

  render() {
    return (
      <div>
        <Status lastSettingsUpdate={this.state.lastSettingsUpdate} />
        <Settings
          onUpdate={hasChanged => hasChanged && this.setState({ lastSettingsUpdate: Date.now() })}
        />
      </div>
    );
  }
}
