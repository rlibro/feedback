import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { pushPath as pushState } from 'redux-simple-router'
import { loadAllRedBooks, updateCurrentUserLocation, updateLoginUserInfo, findingKeyWord, logOutUser } from '../actions'

import { resetErrorMessage, facebookLogin } from '../actions'

import Header from '../components/Header'
import CurrentLocation from '../components/CurrentLocation'
import Explore from '../components/Explore'
import RedBookList from '../components/RedBookList'

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
    const { children, loginUser, countries, redBooks, entities, path} = this.props
    
    let klass = (path !== '/')? 'sub':''

    return (
      <div id="app" className={klass}>
        <Header 
          loginUser={loginUser}
          onLogin={this.handleFacebookLogin}
          onLogOut={this.handleLogOut}
          onUpdateCurrentUserLocation={this.props.updateCurrentUserLocation}
          />

        <CurrentLocation 
          onUpdateCurrentUserLocation={this.props.updateCurrentUserLocation}
          loginUser={loginUser} />

        {this.renderErrorMessage()}

        {<Explore 
          onFindThisKeyWord={this.props.findingKeyWord}
          />}

        <RedBookList 
          loginUser={loginUser}
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

    window.fbAsyncInit = function() {

      Parse.FacebookUtils.init({
        appId      : '1155091951184116',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.4'
      });

      //console.log('페북 SDK 로드 완료!', this.props.loginUser)

      this.props.updateLoginUserInfo({facebook: true});
      
      //console.log('세션 유저가 있는지 확인함!');
      const sessionUser = Parse.User.current();
      if( sessionUser ){

        //console.log('세션 유저 있어!', sessionUser.toJSON())


        this.props.updateLoginUserInfo(sessionUser.toJSON())
      } else {
        console.log('세션 유저 없으면 아무일도 없어 그냥 로그인해!!!')
      }

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

  handleFacebookLogin = () => {
    this.props.facebookLogin(this.props.updateLoginUserInfo);    
  };

  handleLogOut = (e) => {
    const { loginUser } = this.props;
    Parse.User.logOut();
    this.props.logOutUser();
  };

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
  facebookLogin: PropTypes.func.isRequired,
  updateCurrentUserLocation: PropTypes.func.isRequired,
  updateLoginUserInfo: PropTypes.func.isRequired,
  children: PropTypes.node
}

function mapStateToProps(state) {

  return {
    path: state.routing.path,
    errorMessage: state.errorMessage,
    loginUser: state.login,
    countries: state.pagination.countries,
    redBooks: state.pagination.redBooks,
    entities: state.entities
  }
}

export default connect(mapStateToProps, {
  facebookLogin,
  resetErrorMessage,
  pushState,
  findingKeyWord,
  loadAllRedBooks,
  updateCurrentUserLocation,
  updateLoginUserInfo,
  logOutUser
})(App)