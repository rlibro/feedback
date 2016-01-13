import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'

import App from './App'
import RedBookPage from './RedBookPage'
import NewRedBookPage from './NewRedBookPage'

export default class Root extends Component {
  
  render() {
    const { store, history } = this.props;
  
    return (
      <Provider store={store}>
        <div id="wrap">
          <Router history={history}>
            <Route path="/" component={App}>
              <Route path="/:RedBookUID" component={RedBookPage}/>
              <Route path="/redbooks/:countryName" component={NewRedBookPage}/>
            </Route>
          </Router>
        </div>
      </Provider>
    )
  }
  
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}