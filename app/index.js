import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';
import initService from './spade-service';
import serviceHelper from './service-helper';

const store = configureStore();

// Note: when the app is installed, it runs as a service on windows.
// when running as production or development mode through npm, run the service
// on the render through (by initing here) for easier debudding.
if (serviceHelper.appMode() !== 'installed') {
  initService();
}

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root'),
    );
  });
}
