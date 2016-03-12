import './less/style.less';

import React from 'react'
import { render } from 'react-dom'
import Root from './containers/Root'
import configureStore from './store/configureStore'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore  } from 'react-router-redux'

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState);
const history = syncHistoryWithStore(browserHistory, store)


render(
  <Root store={store} history={history} />, 
  document.getElementById('root')
);