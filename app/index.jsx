import './less/style.less';

import React from 'react'
import { render } from 'react-dom'
import Root from './containers/Root'
import configureStore from './store/configureStore'
import { createHistory } from 'history'
import { syncReduxAndRouter  } from 'redux-simple-router'

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState);
const history = createHistory()

syncReduxAndRouter(history, store)
Parse.initialize('oI9ho8CTpm5bFDliirnMFEdH3UGCzaBI8YHBtlnD', '97zh1DEXSPm7DiJjRZYy8KXJBMUVmSxUrScJlgAh');

render(
  <Root store={store} history={history} />, 
  document.getElementById('root')
);