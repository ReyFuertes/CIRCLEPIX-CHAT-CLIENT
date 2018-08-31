import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { loadPreferences } from './actions/preferences-action';
import App from './components/app';
import configureStore from './store/configure-store';
import * as constants from './shared/constants/appVar';
import WebUtility from './shared/web-utility';

import './index.css';

var identity = {
  agentId: WebUtility.getAgentID(),
  id: constants.paramIdentity()
};

const store = configureStore();
store.dispatch(loadPreferences(identity));

if (WebUtility.getEnvSetup() === 'local-dev') {
  localStorage.setItem('debug', 'cpx-chat:*');
}

render(
  <Provider store={store}>
    <div>
      <App />
    </div>
  </Provider>,
  document.querySelector('.cpx_chat-container')
);
