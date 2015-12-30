import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'

import App from './App'
import UserPage from './UserPage'
import RedBookPage from './RedBookPage'
import DevTools from './DevTools'


export default class Root extends Component {
  render() {
    const { store, history } = this.props

    return (
      <Provider store={store}>
        <div id="wrap">
          <Router history={history}>
            <Route path="/" component={App}>
              <Route path="/guide/:redBookId" component={RedBookPage}/>
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