import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadAllCounties, loadAllRedBooks, updateCurrentUserLocation, updateLoginUser, findingKeyWord, logOutUser } from '../actions'
import { pushPath as pushState } from 'redux-simple-router'
import Explore from '../components/Explore'
import Header from '../components/Header'
import RedBookList from '../components/RedBookList'
import { resetErrorMessage } from '../actions'

function loadData(props) {
  props.loadAllRedBooks()
}

class App extends Component {

  componentWillMount() {

    loadData(this.props)
  }

  renderErrorMessage() {
    const { errorMessage } = this.props
    if (!errorMessage) {
      return null
    }

    return (
      <p style={{ backgroundColor: '#e99', padding: 10 }}>
        <b>{errorMessage}</b>
        {' '}
        (<a href="#"
            onClick={this.handleDismissClick.bind(this)}>
          Dismiss
        </a>)
      </p>
    )
  }

  render() {
    const { children, login, countries, redBooks, entities, path} = this.props
    
    let klass = (path !== '/')? 'sub':''

    return (
      <div id="app" className={klass}>
        <Header 
          onLogin={this.handleFacebookLogin}
          onMoveHome={this.handleChangePath.bind(this, '/')} 
          onMoveMyNote={this.handleChangePath.bind(this, 'note')} 
          onUpdateCurrentUserLocation={this.props.updateCurrentUserLocation}
          onUpdateLoginUser={this.props.updateLoginUser}
          onLogOutUser={this.props.logOutUser}
          loginUser={login} />

        {this.renderErrorMessage()}

        {<Explore 
          onFindThisKeyWord={this.props.findingKeyWord}
          />}

        <RedBookList 
          loginUser={login}
          redBooks={redBooks} 
          entities={entities} 
          onOpenRedBook={this.handleOpenRedBook}
          onCreateRedBook={this.handleCreateRedBook}
          />

        {children}
      </div>
    )
  }

  componentDidMount() {

    const sessionUser = Parse.User.current();
    if( sessionUser ){

      let userInfo = sessionUser.toJSON();
      userInfo.id = sessionUser.id;
      delete userInfo.objectId;

      this.props.updateLoginUser(userInfo)
    }


    window.fbAsyncInit = function() {

      Parse.FacebookUtils.init({
        appId      : '1155091951184116',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.4'
      });


    }.bind(this);

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }

  handleDismissClick = (e) => { 
    this.props.resetErrorMessage()
    e.preventDefault()
  };

  handleChangePath = (path, e) => {
    this.props.pushState(path);
    e.preventDefault()
  };

  handleOpenRedBook = (redBook, e) => {
    this.props.pushState(`/${redBook.uname}`)
    e.preventDefault()
  };

  handleCreateRedBook = (loc, e) => {

    const { cityName, countryName } = loc;
    this.props.pushState(`/redbooks/${cityName.replace(/\s/g,'_')},${countryName.replace(/\s/g,'_')}`, `${cityName.replace(/\s/g,'_')},${countryName.replace(/\s/g,'_')}`);
    e.preventDefault();
  };
}

App.propTypes = {
  errorMessage: PropTypes.string,
  resetErrorMessage: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  updateCurrentUserLocation: PropTypes.func.isRequired,
  loadAllCounties: PropTypes.func.isRequired,
  children: PropTypes.node
}

function mapStateToProps(state) {

  return {
    path: state.routing.path,
    errorMessage: state.errorMessage,
    login: state.login,
    countries: state.pagination.countries,
    redBooks: state.pagination.redBooks,
    entities: state.entities
  }
}

export default connect(mapStateToProps, {
  resetErrorMessage,
  pushState,
  findingKeyWord,
  loadAllCounties,
  loadAllRedBooks,
  updateCurrentUserLocation,
  updateLoginUser,
  logOutUser
})(App)