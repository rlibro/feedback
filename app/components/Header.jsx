import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';

export default class Header extends Component {
  
  render() {
    const { loginUser, appState:{sidebar} } = this.props;

    let klassName;
    if( sidebar ){
      klassName = 'stack-menu opened'
    }else {
      klassName = 'stack-menu'
    }

    return <header className="Header">
    
      <div className={klassName} onClick={this.handleToggleSideBar}>
        <i className="fa fa-book"/>
      </div>
      <h1 className="logo" ref="logo">  
        <a href="/" onClick={this.handleHome}>
          <span className="service-name">rlibro</span>
          <span className="beta">beta</span>
        </a>
        <span className="tagline">social travel guide</span>
      </h1>

      { this.renderLoginUserInfo(loginUser) }
      { this.renderFaceBookLogin(loginUser) }
    
    </header>
  }

  renderFaceBookLogin = (loginUser) => {
    if( !loginUser.facebook || loginUser.facebook === 'LOADED' ) {
      return false;
    }

    return <ul className="account-menu">
      <li><a href="#" className="fb-login" onClick={this.handleFacebookLogin}><i className="fa fa-facebook"/> Login with Facebook</a></li>
    </ul>
  };

  renderLoginUserInfo = (loginUser) => {

    if( !loginUser.id ) {
      return false;
    }

    return <ul className="account-menu">
      <li>
        <div className="photo" onClick={this.handleProfile}>
          <img src={loginUser.picture}/>
        </div>
        <ul className="sub-menu">
          <li><a href="#" onClick={this.handleFacebookLogout}><i className="fa fa-sign-out"></i> Logout</a></li>
        </ul>
      </li>
      
    </ul>
  };

  handleToggleSideBar = (e) => {
    this.props.onUpdateAppState({
      sidebar: !this.props.appState.sidebar
    });


    const node = findDOMNode(this.refs.logo);
    node.focus();
  };


  handleFacebookLogin = (e) => {
    this.props.onLogin();
  };

  handleFacebookLogout = (e) => {
    this.props.onLogOut();
    e.preventDefault();
  };

  handleHome = (e) => {
    this.props.onPushState('/');
    e.preventDefault();
  };

  handleProfile = (e) => {
    this.props.onPushState('/profile');
    e.preventDefault();
  };

  fetchUserInfo = () => {
    
    const { onUpdateLoginUser } = this.props;
    const loginUser = Parse.User.current();
    let loginInfo = loginUser.toJSON()
    loginInfo.id = loginUser.id;
    delete loginInfo.objectId;

        
  };
}

Header.propTypes = {
  loginUser: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
  onPushState: PropTypes.func.isRequired,
  onUpdateAppState: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired
}

