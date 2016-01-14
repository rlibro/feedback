import React, { Component, PropTypes } from 'react';
import Footer from '../components/Footer'

export default class SideBar extends Component {

  render(){

    const { loginUser, appState:{sidebar} } = this.props;

    let klassName;
    if( sidebar ){
      klassName = 'SideBar opened'
    }else {
      klassName = 'SideBar'
    }

    let style = {
      height: $(window).height() - 54
    }

    return <div className="wrap-SideBar">
      <div className={klassName} style={style}>
        <ul className="account-menu">
          { this.renderUserProfileInfo(loginUser) }
          { this.renderCurrentLocation(loginUser) }
          { this.renderFaceBookLogin(loginUser) }  
          <li className="separator"></li>
          { this.renderLogOut(loginUser) }
        </ul>
        <Footer />
      </div>

      {this.renderDimmed(sidebar)}
      
    </div>
  }

  renderUserProfileInfo = (loginUser) => {
    if( !loginUser.id ){ return false }

    return <li className="profile">
      <div className="photo">
        <img src={loginUser.picture}/>
      </div>
      <div>
        {loginUser.username}
      </div>
    </li>

  };

  renderCurrentLocation = (loginUser) => {

    if( !loginUser.current_location ) {
      return false;
    }

    return <li>
      <div>
        {loginUser.current_location.cityName}
      </div>
      <div>
        {loginUser.current_location.countryName}
      </div>
    </li>

  };

  renderFaceBookLogin = (loginUser) => {
    if( !loginUser.facebook || loginUser.facebook === 'LOADED' ) {
      return false;
    }

    return <li>
      <button className="fb-login" onClick={this.handleFacebookLogin}>
        <i className="fa fa-facebook"/> Login with Facebook
      </button>
    </li>
  };

  renderLogOut = (loginUser) => {

    if( !loginUser.id ) {
      return false;
    }

    return<li>
      <button onClick={this.handleFacebookLogout}>
        <i className="fa fa-sign-out"></i> Logout
      </button>
    </li>
  };

  renderDimmed = (sidebar) => {
    if(sidebar){
     return <div className="dimmed" onClick={this.handleToggleSideBar}></div>  
    }
    return false;
  };

  handleToggleSideBar = (e) => {
    this.props.onUpdateAppState({
      sidebar: false
    });
  };

  handleFacebookLogin = (e) => {
    this.props.onLogin();
  };

  handleFacebookLogout = (e) => {
    this.props.onLogOut();
    e.preventDefault();
  };

}

SideBar.propTypes = {
  appState: PropTypes.object.isRequired,
  onUpdateAppState: PropTypes.func.isRequired,
  loginUser: PropTypes.object.isRequired,
  onLogin: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired
}
