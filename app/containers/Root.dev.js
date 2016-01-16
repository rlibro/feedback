import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'

import App from './App'
import UserProfilePage from './UserProfilePage'
import RedBookPage from './RedBookPage'
import NewRedBookPage from './NewRedBookPage'
import CityPeoplePage from './CityPeoplePage'
import DevTools from './DevTools'


export default class Root extends Component {

  render() {
    const { store, history } = this.props;
  
    return (
      <Provider store={store}>
        <div id="wrap">
          <Router history={history}>
            <Route path="/" component={App}>
              <Route path="/profile" component={UserProfilePage}/>
              <Route path="/guide/:uname" component={RedBookPage}>
                <Route path="/guide/:uname/people" component={CityPeoplePage}/>
              </Route>
              <Route path="/crate/:uname" component={NewRedBookPage}/>
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