// @flow
import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import injectTapEventPlugin from 'react-tap-event-plugin';
import type { Children } from 'react'
import Status from '../components/Status';

injectTapEventPlugin();

export default class App extends Component {
  props: {
    children: Children
  };

  render() {
    const maxHeight = window.innerHeight - 64;

    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title="Spade"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
          <Status />
          <div style={{ maxHeight: maxHeight, overflow: 'auto' }}>
            {this.props.children}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
