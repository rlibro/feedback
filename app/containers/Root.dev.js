import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'

import App from './App'
import UserProfilePage from './UserProfilePage'
import RedBookPage from './RedBookPage'
import NewRedBookPage from './NewRedBookPage'
import CityPeoplePage from './CityPeoplePage'
import CityMapPage from './CityMapPage'
import SingleNotePage from './SingleNotePage'
import CreateNotePage from './CreateNotePage'
import SingleNotePlacePage from './SingleNotePlacePage'
import RegisterPage from './RegisterPage'
import RlibriansPage from './RlibriansPage'
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
              <Route path="/register" component={RegisterPage}/>
              <Route path="/rlibrians" component={RlibriansPage}/>
              <Route path="/guide/:uname" component={RedBookPage}>
                <Route path="/guide/:uname/people" component={CityPeoplePage}/>
                <Route path="/guide/:uname/map" component={CityMapPage}/>
                <Route path="/guide/:uname/create" component={CreateNotePage}/>
              </Route>
              <Route path="/notes/:noteId" component={SingleNotePage}>
                <Route path="/notes/:noteId/places/:placeId" component={SingleNotePlacePage}/>
              </Route>
              <Route path="/create/:uname" component={NewRedBookPage}/>
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