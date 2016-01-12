import React, { Component, PropTypes } from 'react'

export default class Header extends Component {

  renderFaceBookLogin = (loginUser) => {
    if( !loginUser.facebook || loginUser.facebook === 'LOADED' ) {
      return false;
    }

    return <ul className="account-menu">
      <li><a href="#" className="fa fa-facebook fb-login" onClick={this.handleFacebookLogin}> Login with Facebook</a></li>
    </ul>
  };

  renderLoginUserInfo = (loginUser) => {

    if( !loginUser.id ) {
      return false;
    }

    return <ul className="account-menu">
      <li>
        <div className="photo">
          <img src={loginUser.picture}/>
        </div>
        <ul className="sub-menu">
          <li><a href="#" onClick={this.handleFacebookLogout}><i className="fa fa-sign-out"></i> Logout</a></li>
        </ul>
      </li>
      
    </ul>
  };
  
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
      <h1 className="logo">  
        <a href="/">
          <span>RedBook</span>
        </a>
      </h1>
      { this.renderLoginUserInfo(loginUser) }
      { this.renderFaceBookLogin(loginUser) }
    
    </header>
  }

  handleToggleSideBar = (e) => {
    this.props.onUpdateAppState({
      sidebar: !this.props.appState.sidebar
    })
  };


  handleFacebookLogin = (e) => {
    this.props.onLogin();
  };

  handleFacebookLogout = (e) => {
    this.props.onLogOut();
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
  onUpdateAppState: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired
}

